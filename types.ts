
export type SubjectType = 'AUTO' | 'FEMALE' | 'MALE' | 'KID' | 'COUPLE' | 'PETS' | 'PORTRAIT';
export type ArtStyleKey = 'ANIME' | 'GHIBLI' | 'PIXAR';
export type Tier = '1' | '2' | '3';
export type AspectRatio = '1:1' | '4:5' | '9:16' | '16:9';
export type LayoutMix = 'CLARITY' | 'SPLIT_HEAVY' | 'HERO_HEAVY';

export interface ArtStyleDetails {
  key: ArtStyleKey;
  label: string;
  promptCues: string;
  renderStyle: string;
  uiVibe: string;
}

export interface Concept {
  id: string;
  conceptKey: string;
  countryIso: string;
  countryName: string;
  zone: string;
  lang: string;
  style: ArtStyleDetails;
  tier: Tier;
  subjectPlan: string;
  identityAnchor: string;
  everydayOutfit: string;
  beforePlace: string;
  afterPlace: string;
  camera: string;
  motif: string;
  layoutId: string;
  headline: string;
  subheadline: string;
  dont: string;
  promptEn?: string;
  imageB64?: string;
  status?: 'pending' | 'generating' | 'completed' | 'error';
}

export interface CountryProfile {
  iso: string;
  name: string;
  zone: string;
  defaultLang: string;
  langs: string[];
  placesEveryday: string[];
  wardrobeEveryday: string[];
  casting: string[];
  camera: string[];
}

export interface ZoneConfig {
  casting: string[];
  camera: string[];
  wardrobeEveryday: string[];
  placesEveryday: string[];
}