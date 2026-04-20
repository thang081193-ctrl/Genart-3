import { ZoneConfig, CountryProfile, ArtStyleDetails, ArtStyleKey } from './types';

export const I18N: Record<string, { name: string; before: string; after: string; cta: string }> = {
  en: { name: "English", before: "REALITY", after: "MAGIC", cta: "Download App Free" },
  vi: { name: "Tiếng Việt", before: "THỰC TẾ", after: "PHÉP THUẬT", cta: "Tải App Miễn Phí" },
  ja: { name: "日本語", before: "現実", after: "魔法", cta: "アプリを無料でダウンロード" },
  ko: { name: "한국어", before: "현실", after: "마법", cta: "앱 무료 다운로드" },
  th: { name: "ไทย", before: "ความจริง", after: "เวทมนตร์", cta: "ดาวน์โหลดแอปฟรี" },
  es: { name: "Español", before: "REALIDAD", after: "MAGIA", cta: "Descargar App Gratis" },
  fr: { name: "Français", before: "RÉALITÉ", after: "MAGIE", cta: "Télécharger l'app gratuite" },
  id: { name: "Bahasa Indonesia", before: "REALITA", after: "SIHIR", cta: "Unduh App Gratis" },
  pt: { name: "Português", before: "REALIDADE", after: "MAGIA", cta: "Baixar App Grátis" },
  it: { name: "Italiano", before: "REALTÀ", after: "MAGIA", cta: "Scarica App Gratis" },
  de: { name: "Deutsch", before: "REALITÄT", after: "MAGIE", cta: "App kostenlos herunterladen" },
};

export const ART_STYLES: Record<ArtStyleKey, ArtStyleDetails> = {
  ANIME: {
    key: 'ANIME',
    label: 'Anime / Manga',
    promptCues: 'High-quality cel-shaded anime, sharp lineart, vibrant manga colors, 2D aesthetic, Shonen style.',
    renderStyle: 'Anime Masterpiece',
    uiVibe: 'Bold Manga lines with dynamic speed-line accents'
  },
  GHIBLI: {
    key: 'GHIBLI',
    label: 'Ghibli-inspired',
    promptCues: 'Studio Ghibli aesthetic, hand-painted watercolor textures, soft dreamy lighting, nostalgic cinematic atmosphere.',
    renderStyle: 'Hand-painted Watercolor',
    uiVibe: 'Soft paper textures and dreamy nature motifs'
  },
  PIXAR: {
    key: 'PIXAR',
    label: 'Pixar / Disney 3D',
    promptCues: 'Disney-style 3D render, stylized proportions, expressive eyes, sub-surface scattering skin, cinematic 3D lighting.',
    renderStyle: 'Stylized 3D Animation',
    uiVibe: 'Glowing 3D neon borders and polished glass effects'
  }
};

export const ZONE_BASE: Record<string, ZoneConfig> = {
  SEA: {
    casting: ["Southeast Asian woman", "Southeast Asian man", "Southeast Asian kid", "Southeast Asian couple"],
    camera: ["mirror selfie holding smartphone", "handheld phone selfie"],
    wardrobeEveryday: ["casual hoodie", "worn t-shirt", "local street wear", "casual local outfit"],
    placesEveryday: ["ordinary bedroom", "simple local cafe", "street corner", "living room"],
  },
  EAST_ASIA: {
    casting: ["East Asian young woman", "East Asian young man", "East Asian couple"],
    camera: ["minimalist smartphone selfie", "mirror reflection"],
    wardrobeEveryday: ["casual oversized shirt", "minimalist sweater", "neat city wear"],
    placesEveryday: ["plain modern room", "neat city street", "minimalist cafe"],
  },
  GLOBAL_WEST: {
    casting: ["Western young woman", "Western young man", "Western couple"],
    camera: ["raw handheld phone selfie", "mirror selfie in bathroom"],
    wardrobeEveryday: ["denim jacket", "casual sweater", "modern casual outfit"],
    placesEveryday: ["kitchen", "living room", "bedroom", "urban street"],
  },
  LATAM: {
    casting: ["Latin American woman", "Latin American man", "Latin American couple"],
    camera: ["vibrant handheld selfie", "outdoor mirror selfie"],
    wardrobeEveryday: ["bright casual clothes", "summer wear", "jeans and t-shirt"],
    placesEveryday: ["balcony", "bright living room", "sunny street", "patio"],
  }
};

export const COUNTRY_OVERRIDES: Record<string, Partial<CountryProfile>> = {
  VN: { name: "Vietnam", zone: "SEA", defaultLang: "vi", langs: ["vi", "en"] },
  TH: { name: "Thailand", zone: "SEA", defaultLang: "th", langs: ["th", "en"] },
  ID: { name: "Indonesia", zone: "SEA", defaultLang: "id", langs: ["id", "en"] },
  PH: { name: "Philippines", zone: "SEA", defaultLang: "en", langs: ["en"] },
  SG: { name: "Singapore", zone: "SEA", defaultLang: "en", langs: ["en"] },
  MY: { name: "Malaysia", zone: "SEA", defaultLang: "en", langs: ["en"] },
  KR: { name: "South Korea", zone: "EAST_ASIA", defaultLang: "ko", langs: ["ko", "en"] },
  JP: { name: "Japan", zone: "EAST_ASIA", defaultLang: "ja", langs: ["ja", "en"] },
  US: { name: "United States", zone: "GLOBAL_WEST", defaultLang: "en", langs: ["en"] },
  GB: { name: "United Kingdom", zone: "GLOBAL_WEST", defaultLang: "en", langs: ["en"] },
  ES: { name: "Spain", zone: "GLOBAL_WEST", defaultLang: "es", langs: ["es", "en"] },
  FR: { name: "France", zone: "GLOBAL_WEST", defaultLang: "fr", langs: ["fr", "en"] },
  IT: { name: "Italy", zone: "GLOBAL_WEST", defaultLang: "it", langs: ["it", "en"] },
  DE: { name: "Germany", zone: "GLOBAL_WEST", defaultLang: "de", langs: ["de", "en"] },
  BR: { name: "Brazil", zone: "LATAM", defaultLang: "pt", langs: ["pt", "en"] },
  MX: { name: "Mexico", zone: "LATAM", defaultLang: "es", langs: ["es", "en"] },
};

export const COPY_TEMPLATES: Record<string, { h: string[]; s: string[] }> = {
  en: { 
    h: ["See Your Animated Soul", "Magic Mirror Reflection", "Beyond Reality"], 
    s: ["Transform instantly", "Your character awaits", "Try it for free"] 
  },
  vi: { 
    h: ["Soi bóng nhân vật AI", "Gương thần biến hình", "Phiên bản hoạt hình của bạn"], 
    s: ["Biến đổi trong tích tắc", "Khám phá bản thân mới", "Trải nghiệm miễn phí"] 
  },
  ja: { 
    h: ["アニメの魂を見る", "魔法の鏡の反射", "現実を超えて"], 
    s: ["一瞬で変身", "あなたのキャラが待っている", "無料で試す"] 
  },
  ko: { 
    h: ["애니메이션 소울을 만나보세요", "마법 거울의 투영", "현실 그 너머"], 
    s: ["순식간에 변신", "당신의 캐릭터가 기다립니다", "무료 체험"] 
  },
  th: { 
    h: ["ดูจิตวิญญาณอนิเมะของคุณ", "เงาสะท้อน từกระจกวิเศษ", "เหนือกว่าความเป็นจริง"], 
    s: ["เปลี่ยนร่างในพริบตา", "ตัวละครของคุณรออยู่", "ลองใช้ฟรี"] 
  },
  es: { 
    h: ["Mira tu alma animada", "Reflejo del Espejo Mágico", "Más allá de la realidad"], 
    s: ["Transfórmate al instante", "Tu personaje te espera", "Pruébalo gratis"] 
  },
  fr: { 
    h: ["Voyez votre âme animée", "Reflet du miroir magique", "Au-delà de la réalité"], 
    s: ["Transformez-vous instantanément", "Votre personnage vous attend", "Essai gratuit"] 
  },
  pt: { 
    h: ["Veja sua alma animada", "Reflexo do Espelho Mágico", "Além da realidade"], 
    s: ["Transforme-se instantaneamente", "Seu personagem espera", "Experimente grátis"] 
  },
  it: { 
    h: ["Guarda la tua anima animata", "Riflesso dello specchio magico", "Oltre la realtà"], 
    s: ["Trasformati istantaneamente", "Il tuo personaggio ti aspetta", "Prova gratuita"] 
  },
  de: { 
    h: ["Sieh deine animierte Seele", "Spiegelbild der Magie", "Jenseits der Realität"], 
    s: ["Sofort verwandeln", "Dein Charakter wartet", "Kostenlos testen"] 
  },
};