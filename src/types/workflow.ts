import { CropType, ProcurementStatus } from './index';

export interface WorkflowStageDefinition {
  id: ProcurementStatus;
  label: string;
  shortDescription: string;
  roleResponsible: 'farmer' | 'officer' | 'factory';
  requiredPreviousStage?: ProcurementStatus;
  isTerminal?: boolean;
}

export interface CropSpecificParameter {
  key: string;
  label: string;
  unit: string;
  minValue: number;
  maxValue: number;
  idealRange: string;
  description: string;
}

export interface CropWorkflowConfig {
  cropType: CropType;
  industry: string;
  industryIcon: string; // Lucide icon name
  defaultUnit: 'Quintals' | 'Metric Tonnes' | 'Kilograms';
  ratePerUnitMsp: number; // In INR (e.g. ₹315/Quintal for cane, ₹7122 for cotton)
  allowedVarieties: string[];
  qualityParameters: CropSpecificParameter[];
  stages: WorkflowStageDefinition[];
  harvestDurationMonths: number;
}
