import { CropType } from '../types';

export interface CropMetadata {
  type: CropType;
  industry: 'Sugar' | 'Textile' | 'Oilseed' | 'Tea & Coffee' | 'Grain' | 'Pulses';
  description: string;
  varieties: string[];
  growingSeasonMonths: number;
  expectedYieldPerAcreKg: number;
  benchmarkPricePerKg: number; // In INR
  color: string;
  iconName: string;
}

export const SUPPORTED_CROPS: Record<CropType, CropMetadata> = {
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
    description: 'Medium and long staple fiber crop for ginning and spinning mills.',
    varieties: ['Bt Cotton RCH-2', 'Bollgard II', 'MCU-5', 'Suraj', 'DCH-32'],
    growingSeasonMonths: 6,
    expectedYieldPerAcreKg: 1200,
    benchmarkPricePerKg: 71.20, // ₹7,120 / Quintal MSP
    color: 'sky',
    iconName: 'Shirt',
  },
  Wheat: {
    type: 'Wheat', industry: 'Grain', description: 'Rabi cereal for flour mills and bulk grain buyers.',
    varieties: ['HD 2967', 'HD 3086', 'Lok 1', 'PBW 343', 'DBW 187'], growingSeasonMonths: 5,
    expectedYieldPerAcreKg: 1800, benchmarkPricePerKg: 24.25, color: 'amber', iconName: 'Wheat',
  },
  Barley: {
    type: 'Barley', industry: 'Grain', description: 'Rabi cereal for malting, animal feed and food-processing units.',
    varieties: ['RD 2035', 'DWRB 101', 'BH 902', 'K 551'], growingSeasonMonths: 4,
    expectedYieldPerAcreKg: 1500, benchmarkPricePerKg: 23.50, color: 'amber', iconName: 'Wheat',
  },
  Rice: {
    type: 'Rice', industry: 'Grain', description: 'Paddy for rice mills, parboiling units and exporters.',
    varieties: ['Basmati 1121', 'Sona Masuri', 'IR 64', 'MTU 1010', 'Swarna'], growingSeasonMonths: 5,
    expectedYieldPerAcreKg: 2400, benchmarkPricePerKg: 23.00, color: 'lime', iconName: 'Wheat',
  },
  Maize: {
    type: 'Maize', industry: 'Grain', description: 'Feed and industrial-grade maize for processors.',
    varieties: ['DHM 117', 'HQPM 1', 'Pioneer 3396', 'Ganga 5'], growingSeasonMonths: 4,
    expectedYieldPerAcreKg: 2200, benchmarkPricePerKg: 22.25, color: 'yellow', iconName: 'Wheat',
  },
  Bajra: {
    type: 'Bajra', industry: 'Grain', description: 'Drought-resilient pearl millet for food and feed buyers.',
    varieties: ['HHB 67 Improved', 'ICTP 8203', 'RHB 177', 'GHB 558'], growingSeasonMonths: 3,
    expectedYieldPerAcreKg: 1100, benchmarkPricePerKg: 26.25, color: 'stone', iconName: 'Wheat',
  },
  Chana: {
    type: 'Chana', industry: 'Pulses', description: 'Gram crop for dal mills and institutional buyers.',
    varieties: ['JG 11', 'Pusa 372', 'Vijay', 'JAKI 9218'], growingSeasonMonths: 4,
    expectedYieldPerAcreKg: 900, benchmarkPricePerKg: 56.50, color: 'orange', iconName: 'Package',
  },
  'Tur Dal': {
    type: 'Tur Dal', industry: 'Pulses', description: 'Pigeon pea for dal mills and food processors.',
    varieties: ['BSMR 736', 'Asha ICPL 87119', 'Maruti', 'PKV Tara'], growingSeasonMonths: 6,
    expectedYieldPerAcreKg: 750, benchmarkPricePerKg: 80.00, color: 'rose', iconName: 'Package',
  },
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
  Soybean: {
    type: 'Soybean',
    industry: 'Oilseed',
    description: 'High-protein, 18-20% oil content Kharif oilseed for solvent extraction.',
    varieties: ['JS 335', 'JS 95-60', 'NRC 37', 'MACS 1407', 'RVS 2001-4'],
    growingSeasonMonths: 3.5,
    expectedYieldPerAcreKg: 1100,
    benchmarkPricePerKg: 46.00, // ₹4,600 / Quintal MSP
    color: 'yellow',
    iconName: 'Package',
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
    growingSeasonMonths: 9, // Perennial flush cycles
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
  'Wheat',
  'Barley',
  'Rice',
  'Maize',
  'Bajra',
  'Chana',
  'Tur Dal',
  'Mustard',
  'Soybean',
  'Sunflower',
  'Groundnut',
  'Tea',
  'Coffee',
];
