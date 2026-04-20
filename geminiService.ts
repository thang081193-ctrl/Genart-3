
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Concept } from './types';

interface PolishedItem {
  id: string;
  headline: string;
  subheadline: string;
}

/**
 * Polishes the headline and subheadline for each concept using Gemini 3 Pro.
 * Uses responseSchema to ensure valid JSON output.
 */
export const polishCopy = async (
  modelName: string,
  concepts: Concept[],
  lang: string,
  countryName: string
): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const maxH = 22, maxS = 36;

  const input = concepts.map(c => ({
    id: c.id,
    country: countryName,
    style: c.style.label,
    headline: c.headline,
    subheadline: c.subheadline
  }));

  const prompt = `
ROLE: Expert copywriter for AI-based Magic Mirror apps.
TASK: Polish the headline and subheadline to sound magical, exciting, and local in ${lang.toUpperCase()}.

CONTEXT:
- The app transforms real people into ${input[0]?.style || 'stylized'} characters.
- Use a "Magic Mirror" tone (mysterious, magical, self-discovery).

STRICT LANGUAGE RULE:
- Output ONLY in ${lang.toUpperCase()}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt + `\nInput: ${JSON.stringify(input)}` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "The original concept ID" },
                  headline: { type: Type.STRING, description: "The polished headline" },
                  subheadline: { type: Type.STRING, description: "The polished subheadline" },
                },
                required: ["id", "headline", "subheadline"],
              },
            },
          },
          required: ["items"],
        },
        thinkingConfig: { thinkingBudget: 2000 },
        temperature: 0.5,
      }
    });

    const text = response.text || "{}";
    // Using simple trim as responseMimeType: application/json is set
    const parsed = JSON.parse(text.trim());
    const map = new Map<string, PolishedItem>((parsed.items || []).map((x: any) => [x.id, x as PolishedItem]));
    
    for (const c of concepts) {
      const it = map.get(c.id);
      if (it?.headline) c.headline = it.headline.slice(0, maxH);
      if (it?.subheadline) c.subheadline = it.subheadline.slice(0, maxS);
    }
  } catch (error) {
    console.error("Copy polish failed", error);
  }
};

/**
 * Generates an ad image using the specified Gemini image model.
 * Iterates through response parts to find the image data.
 */
export const generateAdImage = async (
  modelName: string,
  prompt: string,
  aspectRatio: string
): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: aspectRatio as any, imageSize: "1K" }
      }
    });
    // Iterate through all parts to find the image part as per guidelines
    const candidates = response.candidates || [];
    if (candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed", error);
    throw error;
  }
};
