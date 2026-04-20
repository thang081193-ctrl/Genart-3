
import { 
  Concept, CountryProfile, SubjectType, Tier, 
  LayoutMix, ArtStyleKey, ArtStyleDetails
} from './types';
import { ZONE_BASE, COUNTRY_OVERRIDES, COPY_TEMPLATES, I18N, ART_STYLES } from './constants';

function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pickFrom = <T,>(arr: T[], rnd: () => number): T => arr[Math.floor(rnd() * arr.length)];

export const resolveCountryProfile = (iso: string): CountryProfile => {
  const ov = COUNTRY_OVERRIDES[iso];
  if (!ov) throw new Error("Missing country override: " + iso);
  const zoneKey = ov.zone || 'GLOBAL_WEST';
  const base = ZONE_BASE[zoneKey];
  
  return {
    iso,
    name: ov.name || 'Unknown',
    zone: zoneKey,
    defaultLang: ov.defaultLang || 'en',
    langs: ov.langs || ['en'],
    placesEveryday: ov.placesEveryday || base.placesEveryday,
    wardrobeEveryday: ov.wardrobeEveryday || base.wardrobeEveryday,
    casting: [...(ov.casting || []), ...base.casting],
    camera: [...(ov.camera || []), ...base.camera],
  };
};

export const generateConcepts = async (params: {
  profile: CountryProfile;
  lang: string;
  tier: Tier;
  count: number;
  subjectType: SubjectType;
  layoutMix: LayoutMix;
  styleKey: ArtStyleKey;
}): Promise<Concept[]> => {
  const seed = (Math.random() * 1000000) ^ Date.now();
  const rnd = mulberry32(seed);
  const concepts: Concept[] = [];
  const { profile } = params;

  let castingPool = [...profile.casting];
  
  if (params.subjectType === 'FEMALE') {
    castingPool = castingPool.filter(c => /woman|girl|female/i.test(c));
  } else if (params.subjectType === 'MALE') {
    castingPool = castingPool.filter(c => /man|boy|male/i.test(c));
  } else if (params.subjectType === 'KID') {
    castingPool = castingPool.filter(c => /kid|child/i.test(c));
  } else if (params.subjectType === 'COUPLE') {
    castingPool = castingPool.filter(c => /couple/i.test(c));
  } else if (params.subjectType === 'PETS') {
    castingPool = ["cute domestic dog", "adorable fluffy cat", "playful puppy", "house cat"];
  } else if (params.subjectType === 'PORTRAIT') {
    castingPool = castingPool.map(c => `Extreme close-up portrait of ${c}`);
  }
  
  if (castingPool.length === 0) castingPool = profile.casting;

  for (let i = 0; i < params.count; i++) {
    // Determine unique layoutId based on selection
    let layoutId = 'clarity_balanced';
    if (params.layoutMix === 'SPLIT_HEAVY') layoutId = 'side_by_side_split';
    else if (params.layoutMix === 'HERO_HEAVY') layoutId = 'hero_magic_inset';

    const copySet = COPY_TEMPLATES[params.lang] || COPY_TEMPLATES.en;
    const styleDetails = ART_STYLES[params.styleKey];
    
    const casting = pickFrom(castingPool, rnd);
    const id = Math.random().toString(36).substring(2, 10);
    
    concepts.push({
      id,
      conceptKey: `${profile.iso}_${params.styleKey}_${i}`,
      countryIso: profile.iso,
      countryName: profile.name,
      zone: profile.zone,
      lang: params.lang,
      style: styleDetails,
      tier: params.tier,
      subjectPlan: params.subjectType,
      identityAnchor: params.subjectType === 'PORTRAIT' ? casting : `${casting}, same facial features, distinct hairstyle`,
      everydayOutfit: params.subjectType === 'PETS' ? "natural fur" : pickFrom(profile.wardrobeEveryday, rnd),
      beforePlace: pickFrom(profile.placesEveryday, rnd),
      afterPlace: "Magical artistic background",
      camera: params.subjectType === 'PORTRAIT' ? "extreme face close-up" : pickFrom(profile.camera, rnd),
      motif: "Energy spark",
      layoutId,
      headline: pickFrom(copySet.h, rnd),
      subheadline: pickFrom(copySet.s, rnd),
      dont: "no text distortion; no merged faces; no low quality",
      status: 'pending'
    });
  }

  return concepts;
};

export const buildImagePrompt = (concept: Concept): string => {
  const i18n = I18N[concept.lang] || I18N.en;
  const isPet = concept.subjectPlan === 'PETS';
  const isPortrait = concept.subjectPlan === 'PORTRAIT';
  
  let composition = "";
  if (concept.layoutId === 'side_by_side_split') {
    composition = "LAYOUT: A sharp 50/50 vertical split-screen design. Left side is the Reality photo, Right side is the Magic transformation.";
  } else if (concept.layoutId === 'hero_magic_inset') {
    composition = "LAYOUT: Full-frame Hero view of the 'After' magic character. A small, clear rectangular inset photo of the original 'Before' reality is placed in the bottom-left corner.";
  } else {
    composition = "LAYOUT: Balanced side-by-side comparison. The 'Before' reality and 'After' magic character are placed next to each other with a soft glowing vertical boundary.";
  }
  
  const framing = isPortrait ? "COMPOSITION FOCUS: Extreme close-up of face and eyes only, highly detailed facial features." : "";
  const identityTerm = isPet ? "PET" : "PERSON";
  const ghibliExtra = (concept.style.key === 'GHIBLI' && isPortrait) ? "Enhance storybook look, soft focus, hand-drawn texture on skin and eyes." : "";

  return `
AD CREATIVE: AI MAGIC MIRROR TRANSFORM COMPARISON.
${composition}
${framing}
${ghibliExtra}

[LEFT/BEFORE PANEL - REALITY]:
- Content: Authentic realistic smartphone photo of ${concept.identityAnchor}.
- Scene: ${concept.beforePlace} in ${concept.countryName}.
- Detail: ${isPet ? 'Natural fur texture' : `Outfit: ${concept.everydayOutfit}`}.
- Visual Style: RAW photography, real lighting, ${concept.camera}.
- Label: Small minimalist badge overlay saying "${i18n.before}".

[RIGHT/AFTER PANEL - MAGIC]:
- Content: THE EXACT SAME ${identityTerm} transformed into a ${concept.style.label} character.
- Visual Style: ${concept.style.promptCues}.
- Rendering: ${concept.style.renderStyle}, vibrant colors, magical ${concept.motif}.
- Identity: Flawless ${isPet ? 'breed and fur pattern' : 'facial'} consistency with the reality photo but in the chosen art style.
- Label: Small minimalist badge overlay saying "${i18n.after}".

[OVERALL AD ELEMENTS]:
- Headline: "${concept.headline}" (placed at bottom center).
- Subheadline: "${concept.subheadline}" (below headline).
- CTA: A prominent button at the bottom with the text "${i18n.cta}".

TECHNICAL: High fidelity, perfect consistency, professional ad aesthetic, 1k resolution quality.
  `;
};