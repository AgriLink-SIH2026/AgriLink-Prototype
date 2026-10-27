import { CropType } from '../types';

export interface CropMetadata {
  type: CropType;
  industry: 'Sugar' | 'Textile' | 'Oilseed' | 'Tea & Coffee' | 'Grain Processing';
  description: string;
  varieties: string[];
  growingSeasonMonths: number;
  expectedYieldPerAcreKg: number;
  benchmarkPricePerKg: number; // In INR
  color: string;
  iconName: string;
}

export const SUPPORTED_CROPS: Record<CropType, CropMetadata> = {
  // Cash Crops
  Sugarcane: {
    type: 'Sugarcane',
    industry: 'Sugar',
    description: 'High sucrose content cash crop for sugar and ethanol mills.',
    varieties: ['Co 0238', 'Co 86032', 'Co 0118', 'CoLk 94184', 'VSI 434'],
    growingSeasonMonths: 12,
    expectedYieldPerAcreKg: 35000,
    benchmarkPricePerKg: 3.40, // ₹340 / Quintal FRP
    color: 'emerald',
    iconName: 'Sprout',
  },
  Cotton: {
    type: 'Cotton',
    industry: 'Textile',
    description: 'Medium and long staple fiber cash crop for ginning and spinning mills.',
    varieties: ['Bt Cotton RCH-2', 'Bollgard II', 'MCU-5', 'Suraj', 'DCH-32'],
    growingSeasonMonths: 6,
    expectedYieldPerAcreKg: 1200,
    benchmarkPricePerKg: 71.20, // ₹7,120 / Quintal MSP
    color: 'sky',
    iconName: 'Shirt',
  },
  Soybean: {
    type: 'Soybean',
    industry: 'Oilseed',
    description: 'High-protein, 18-20% oil content Kharif cash crop for solvent extraction mills.',
    varieties: ['JS 335', 'JS 95-60', 'NRC 37', 'MACS 1407', 'RVS 2001-4'],
    growingSeasonMonths: 3.5,
    expectedYieldPerAcreKg: 1100,
    benchmarkPricePerKg: 48.92, // ₹4,892 / Quintal MSP
    color: 'yellow',
    iconName: 'Package',
  },

  // Standard Grains
  Wheat: {
    type: 'Wheat',
    industry: 'Grain Processing',
    description: 'Staple Rabi cereal grain for industrial flour mills, bakeries, and state food corporations.',
    varieties: ['Sharbati', 'HD 2967', 'PBW 343', 'Lokwan', 'WH 147'],
    growingSeasonMonths: 4.5,
    expectedYieldPerAcreKg: 1800,
    benchmarkPricePerKg: 22.75, // ₹2,275 / Quintal MSP
    color: 'amber',
    iconName: 'Wheat',
  },
  Rice: {
    type: 'Rice',
    industry: 'Grain Processing',
    description: 'Paddy grain for modern automated parboiled and raw rice milling plants.',
    varieties: ['Basmati 1121', 'Sona Masoori', 'IR 64', 'Pusa Basmati 1509', 'Swarna'],
    growingSeasonMonths: 4,
    expectedYieldPerAcreKg: 2200,
    benchmarkPricePerKg: 23.00, // ₹2,300 / Quintal MSP
    color: 'emerald',
    iconName: 'Wheat',
  },
  Maize: {
    type: 'Maize',
    industry: 'Grain Processing',
    description: 'Industrial corn for starch manufacturing, poultry feed, and ethanol extraction units.',
    varieties: ['HQPM 1', 'Pioneer 30V92', 'DHM 117', 'Ganga 11', 'Bio 9681'],
    growingSeasonMonths: 3.5,
    expectedYieldPerAcreKg: 2500,
    benchmarkPricePerKg: 22.25, // ₹2,225 / Quintal MSP
    color: 'yellow',
    iconName: 'Wheat',
  },

  // Other Oilseeds & Plantations
  Mustard: {
    type: 'Mustard',
    industry: 'Oilseed',
    description: 'Rabi oilseed crop with 38-42% oil content for crushing mills.',
    varieties: ['Pusa Bold', 'RH-30', 'Varuna', 'NRCHB-101', 'Giriraj'],
    growingSeasonMonths: 4,
    expectedYieldPerAcreKg: 850,
    benchmarkPricePerKg: 56.50, // ₹5,650 / Quintal MSP
    color: 'amber',
    iconName: 'Droplet',
  },
  Sunflower: {
    type: 'Sunflower',
    industry: 'Oilseed',
    description: 'Edible oilseed with high polyunsaturated fatty acids.',
    varieties: ['KBSH-1', 'DRSH-1', 'PAC-36', 'MSFH-17', 'Sunbred-275'],
    growingSeasonMonths: 3.5,
    expectedYieldPerAcreKg: 750,
    benchmarkPricePerKg: 67.60,
    color: 'orange',
    iconName: 'Sun',
  },
  Groundnut: {
    type: 'Groundnut',
    industry: 'Oilseed',
    description: 'Premium oil and confectionary legume with 45-50% oil content.',
    varieties: ['TAG 24', 'JL 24 (Phule Pragati)', 'Kadiri 6', 'TG 37A', 'GG 20'],
    growingSeasonMonths: 4,
    expectedYieldPerAcreKg: 1000,
    benchmarkPricePerKg: 63.75,
    color: 'stone',
    iconName: 'Nut',
  },
  Tea: {
    type: 'Tea',
    industry: 'Tea & Coffee',
    description: 'Perennial plantation crop for CTC and orthodox leaf processing.',
    varieties: ['TV 1', 'TV 9', 'UPASI 9', 'AV 2', 'B/5/63'],
    growingSeasonMonths: 9,
    expectedYieldPerAcreKg: 2200,
    benchmarkPricePerKg: 28.50,
    color: 'teal',
    iconName: 'Coffee',
  },
  Coffee: {
    type: 'Coffee',
    industry: 'Tea & Coffee',
    description: 'Shade-grown Arabica and Robusta cherries for curing works.',
    varieties: ['Selection 795', 'Chandragiri', 'Sln 9', 'Robusta CxR', 'Cauvery'],
    growingSeasonMonths: 9,
    expectedYieldPerAcreKg: 1400,
    benchmarkPricePerKg: 85.00,
    color: 'stone',
    iconName: 'Coffee',
  },
};

export const CROP_LIST: CropType[] = [
  'Sugarcane',
  'Cotton',
  'Soybean',
  'Wheat',
  'Rice',
  'Maize',
  'Mustard',
  'Sunflower',
  'Groundnut',
  'Tea',
  'Coffee',
];
