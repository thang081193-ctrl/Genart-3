
import React, { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { 
  SubjectType, Tier, AspectRatio, LayoutMix, Concept, ArtStyleKey 
} from './types';
import { COUNTRY_OVERRIDES, I18N, ART_STYLES } from './constants';
import { resolveCountryProfile, generateConcepts, buildImagePrompt } from './slotEngine';
import { polishCopy, generateAdImage } from './geminiService';
import { 
  Settings, Zap, Image as ImageIcon, Download, 
  Copy, FileJson, Trash2, Loader2, Sparkles, Globe, 
  Layers, Palette, Target, Key, Eye, Wand2, Maximize
} from 'lucide-react';

export default function App() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [thinkingModel, setThinkingModel] = useState('gemini-3-pro-preview');
  const [imageModel, setImageModel] = useState('gemini-3-pro-image-preview');
  
  const [selectedCountry, setSelectedCountry] = useState('VN');
  const [selectedLang, setSelectedLang] = useState('vi');
  const [styleKey, setStyleKey] = useState<ArtStyleKey>('ANIME');
  const [subjectType, setSubjectType] = useState<SubjectType>('AUTO');
  const [tier, setTier] = useState<Tier>('2');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [count, setCount] = useState(5);
  const [layoutMix, setLayoutMix] = useState<LayoutMix>('CLARITY');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // Check if API key has been selected on mount
  useEffect(() => {
    const checkKey = async () => {
      if (typeof (window as any).aistudio !== 'undefined') {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleCountryChange = (iso: string) => {
    setSelectedCountry(iso);
    const config = COUNTRY_OVERRIDES[iso];
    if (config) {
      setSelectedLang(config.defaultLang || 'en');
    }
    setConcepts([]);
  };

  /**
   * Opens the API key selection dialog.
   * Assume success immediately to avoid race conditions.
   */
  const handleSelectKey = async () => {
    if (typeof (window as any).aistudio !== 'undefined') {
      await (window as any).aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  }, []);

  const handleRun = async () => {
    if (!hasKey) {
      await handleSelectKey();
      return;
    }
    
    setIsGenerating(true);
    setConcepts([]);
    setLogs([]);
    
    try {
      addLog(`Activating Magic Mirror for ${selectedCountry}...`);
      const profile = resolveCountryProfile(selectedCountry);
      
      addLog("Step 1: Generating artistic concept slots...");
      const newConcepts = await generateConcepts({
        profile,
        lang: selectedLang,
        tier,
        count,
        subjectType,
        layoutMix,
        styleKey
      });
      setConcepts(newConcepts);

      addLog(`Step 2: Polishing local copy for ${ART_STYLES[styleKey].label}...`);
      await polishCopy(thinkingModel, newConcepts, selectedLang, profile.name);
      setConcepts([...newConcepts]);

      addLog("Step 3: Rendering Magic Mirror reflections (Quality: 1K)...");
      for (const concept of newConcepts) {
        try {
          concept.status = 'generating';
          setConcepts(prev => [...prev]);
          const prompt = buildImagePrompt(concept);
          concept.promptEn = prompt;
          // Generate image with gemini-3-pro-image-preview, strictly 1K
          const base64 = await generateAdImage(imageModel, prompt, aspectRatio);
          if (base64) {
            concept.imageB64 = base64;
            concept.status = 'completed';
            addLog(`Success: Reflection ${concept.id} crystallized.`);
          } else {
            concept.status = 'error';
          }
        } catch (err: any) {
          concept.status = 'error';
          // Check for key selection error as per guidelines
          if (err.message && err.message.includes("Requested entity was not found.")) {
            addLog("Key selection stale. Please select key again.");
            setHasKey(false);
          }
          addLog(`Reflection failed: ${err.message}`);
        }
        setConcepts(prev => [...prev]);
      }
      addLog("Magic Mirror sequence complete.");
    } catch (err: any) {
      addLog(`CRITICAL: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto text-slate-100 selection:bg-violet-500/30">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-violet-900/30 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 italic">
            <Wand2 className="text-violet-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
            AI MAGIC MIRROR <span className="text-slate-500 font-light not-italic">| Style Evolution</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Reality-to-Art Transformation • Identity Preserving • Deep Localized Environments
          </p>
        </div>
        <div className="bg-violet-950/30 border border-violet-500/20 rounded-full px-5 py-1.5 text-xs font-bold text-violet-300 backdrop-blur-md">
          GEN 3 PRO ENGINE ACTIVATED (1K)
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        <aside className="flex flex-col gap-6">
          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 mb-5 flex items-center gap-2">
              <Key className="w-4 h-4" /> Credentials
            </h2>
            <button 
              onClick={handleSelectKey}
              className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                hasKey ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20'
              }`}
            >
              {hasKey ? '✦ KEY ACTIVE ✦' : 'SELECT API KEY'}
            </button>
            <div className="mt-3 px-1">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 hover:text-violet-400 underline">
                Billing Documentation & Project Setup
              </a>
            </div>
          </section>

          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 mb-5 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Transform Style
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(ART_STYLES) as ArtStyleKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setStyleKey(key)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    styleKey === key 
                    ? 'bg-violet-600/20 border-violet-500 text-violet-100' 
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-sm">{ART_STYLES[key].label}</span>
                  {styleKey === key && <Sparkles className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400 mb-5 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Core Params
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] text-slate-500 mb-1 block uppercase font-bold">Country & Environment</label>
                <select value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500">
                  {Object.keys(COUNTRY_OVERRIDES).sort().map(iso => <option key={iso} value={iso}>{COUNTRY_OVERRIDES[iso].name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-slate-500 mb-1 block uppercase font-bold">Output Language</label>
                <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500">
                  {Object.keys(I18N).map(lang => <option key={lang} value={lang}>{I18N[lang].name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mb-1 block uppercase font-bold">Subject</label>
                <select value={subjectType} onChange={(e) => setSubjectType(e.target.value as SubjectType)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500">
                  <option value="AUTO">Mix</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="KID">Kid</option>
                  <option value="COUPLE">Couple</option>
                  <option value="PETS">Pets</option>
                  <option value="PORTRAIT">Portrait</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 mb-1 block uppercase font-bold">Aspect Ratio</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500">
                  <option value="1:1">1:1 Square</option>
                  <option value="4:5">4:5 Portrait</option>
                  <option value="9:16">9:16 Story</option>
                  <option value="16:9">16:9 Cinema</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-slate-500 mb-1 block uppercase font-bold">Layout Style</label>
                <select value={layoutMix} onChange={(e) => setLayoutMix(e.target.value as LayoutMix)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-violet-500">
                  <option value="CLARITY">Clarity Focus</option>
                  <option value="SPLIT_HEAVY">Deep Split</option>
                  <option value="HERO_HEAVY">Hero Centric</option>
                </select>
              </div>
            </div>
          </section>

          <button 
            onClick={handleRun}
            disabled={isGenerating}
            className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              isGenerating 
              ? 'bg-slate-800 text-slate-500' 
              : 'bg-white text-slate-950 hover:bg-violet-400 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="fill-current w-5 h-5" />}
            {isGenerating ? 'Crystalizing...' : 'Activate Mirror'}
          </button>

          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 font-mono text-[10px] h-32 overflow-y-auto text-slate-500">
            {logs.length === 0 ? "Mirror standby..." : logs.map((log, i) => <div key={i} className="mb-1 leading-relaxed border-l border-violet-900/50 pl-2">{log}</div>)}
          </div>
        </aside>

        <main className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">Reflections</h2>
              <p className="text-slate-500 text-xs">Stylized soul projections from the Magic Mirror</p>
            </div>
            {concepts.length > 0 && (
              <button 
                onClick={() => {
                  const blob = new Blob([JSON.stringify(concepts, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = `mirror_export.json`; a.click();
                }}
                className="text-xs text-slate-500 hover:text-white flex items-center gap-2 underline"
              >
                <FileJson className="w-3 h-3" /> Export Metadata
              </button>
            )}
          </div>

          {!isGenerating && concepts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] py-40 opacity-30">
              <Wand2 className="w-16 h-16 mb-6" />
              <p className="font-bold tracking-widest uppercase text-sm">Waiting for Soul Input</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {concepts.map((c) => (
                <ConceptCard key={c.id} concept={c} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Component for displaying a single concept card.
 * Uses React.FC to handle special props like `key` correctly in TypeScript.
 */
const ConceptCard: React.FC<{ concept: Concept }> = ({ concept }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-violet-500/50 transition-all group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-black tracking-widest text-violet-400 uppercase">Ref #{concept.id}</span>
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
            concept.status === 'completed' ? 'bg-green-500/10 text-green-400' :
            concept.status === 'generating' ? 'bg-violet-500/10 text-violet-400 animate-pulse' :
            'bg-slate-800 text-slate-500'
          }`}>
            {concept.status || 'Shadow'}
          </span>
        </div>
        <h3 className="text-lg font-black leading-tight text-white mb-1">{concept.headline}</h3>
        <p className="text-xs text-slate-500 font-medium">{concept.subheadline}</p>
      </div>

      <div className="aspect-[4/5] bg-slate-950 relative overflow-hidden">
        {concept.imageB64 ? (
          <img src={`data:image/png;base64,${concept.imageB64}`} className="w-full h-full object-cover" alt="Magic Reflection" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className={`w-8 h-8 ${concept.status === 'generating' ? 'animate-spin text-violet-500' : 'text-slate-800'}`} />
            <span className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-700">Crystalizing</span>
          </div>
        )}

        <div className="absolute inset-0 bg-violet-950/90 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-8 gap-3 backdrop-blur-md">
           <button onClick={() => setShowPrompt(!showPrompt)} className="w-full py-3 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest">
             {showPrompt ? 'Hide Formula' : 'Show Formula'}
           </button>
           {concept.imageB64 && (
             <button onClick={() => {
               const a = document.createElement('a'); a.href = `data:image/png;base64,${concept.imageB64}`; a.download = `reflection_${concept.id}.png`; a.click();
             }} className="w-full py-3 bg-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
               <Download className="w-3 h-3" /> Save Artifact
             </button>
           )}
        </div>

        {showPrompt && (
          <div className="absolute inset-0 bg-slate-950 p-6 z-20 overflow-y-auto">
            <div className="flex justify-between mb-4 border-b border-slate-800 pb-2">
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Ancient Scroll</span>
              <button onClick={() => setShowPrompt(false)} className="text-slate-500 hover:text-white text-sm">✕</button>
            </div>
            <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed italic">
              {concept.promptEn || "The scroll is blank..."}
            </pre>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center"><Globe className="w-3 h-3 text-slate-600" /></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">{concept.countryName} Context</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center"><Palette className="w-3 h-3 text-slate-600" /></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase">{concept.style.label} Reflection</span>
         </div>
      </div>
    </div>
  );
};