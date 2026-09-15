export type UserRole = 'farmer' | 'factory';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface FarmerProfile {
  userId: string;
  fullName: string;
  phone: string;
  address: string;
  village: string;
  district: string;
  state: string;
  preferredLanguage: string;
  profilePhoto?: string;
  totalLandArea: number;
  landUnit: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
  completionPercentage: number;
}

export type CropType =
  | 'Sugarcane'
  | 'Cotton'
  | 'Wheat'
  | 'Barley'
  | 'Rice'
  | 'Maize'
  | 'Bajra'
  | 'Chana'
  | 'Tur Dal'
  | 'Mustard'
  | 'Soybean'
  | 'Sunflower'
  | 'Groundnut'
  | 'Tea'
  | 'Coffee';

export type CropStatus = 'Registered';

export interface CropRegistration {
  id: string; // e.g., AGRI-CROP-2026-0001
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropType: CropType;
  variety: string;
  landArea: number;
  landUnit: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
  sowingDate: string;
  expectedHarvestDate: string;
  village: string;
  district: string;
  state: string;
  notes?: string;
  status: CropStatus;
  registrationDate: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  capturedAt?: string;
  verificationDate?: string;
  verifiedByOfficerId?: string;
  verifiedByOfficerName?: string;
  officerRemarks?: string;
  rejectionReason?: string;
  inspectionReportId?: string;
}

export type ProcurementStatus =
  | 'Crop Registered'
  | 'Procurement Pending'
  | 'Procurement Scheduled'
  | 'Harvest Scheduled'
  | 'Arrived at Procurement Center'
  | 'Quality Check'
  | 'Weighment'
  | 'Accepted'
  | 'Billing'
  | 'Payment Processed'
  | 'Completed';

export interface QualityRecord {
  id: string;
  grade: 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C (Fair)' | 'Rejected';
  moisturePercentage?: number;
  brixPercentage?: number; // Sugarcane specific
  stapleLengthMm?: number; // Cotton specific
  oilContentPercentage?: number; // Oilseed specific
  cuppingScore?: number; // Tea/Coffee specific
  remarks: string;
  checkedBy: string;
  checkedAt: string;
}

export interface WeighmentRecord {
  id: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number; // Gross - Tare
  weighmentDate: string;
  scaleOperator: string;
  slipNumber: string;
  remarks?: string;
}

export interface BillRecord {
  id: string;
  billNumber: string;
  date: string;
  quantityKg: number;
  ratePerKg: number;
  totalAmount: number; // Net Weight * Rate
  paymentStatus: 'Pending' | 'Processing' | 'Paid';
  paymentDate?: string;
  transactionRef?: string;
}

export interface StatusHistoryItem {
  status: ProcurementStatus;
  timestamp: string;
  notes?: string;
  updatedBy: string;
}

export interface ProcurementRecord {
  id: string;
  cropRegistrationId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  factoryId: string;
  factoryName: string;
  cropType: CropType;
  variety: string;
  landArea: number;
  landUnit: string;
  currentStatus: ProcurementStatus;
  scheduledDate?: string;
  harvestDate?: string;
  batchNumber?: string;
  priority: 'Normal' | 'High' | 'Urgent';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  quality?: QualityRecord;
  weighment?: WeighmentRecord;
  bill?: BillRecord;
  statusHistory: StatusHistoryItem[];
}

export interface InspectionReport {
  id: string;
  cropRegistrationId: string;
  officerId: string;
  officerName: string;
  cropCondition: 'Excellent' | 'Good' | 'Average' | 'Poor';
  fieldCondition: string;
  pestInfestationRisk: 'Low' | 'Moderate' | 'High';
  soilMoistureCondition: 'Adequate' | 'Deficit' | 'Excess';
  estimatedYieldPerAcre: number;
  estimatedYieldPerAcreKg?: number;
  verificationRemarks: string;
  inspectionDate: string;
}

export interface Notification {
  id: string;
  recipientUserId: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  category: 'crop' | 'procurement' | 'quality' | 'payment' | 'system';
  isRead: boolean;
  createdAt: string;
  channels: {
    in_app: boolean;
    sms: boolean;
    ivr: boolean;
  };
  linkUrl?: string;
}

export interface FactoryInfo {
  id: string;
  name: string;
  industryType: 'Sugar' | 'Textile' | 'Oilseed' | 'Tea & Coffee' | 'Grain' | 'Pulses';
  supportedCrops: CropType[];
  district: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  dailyCapacityTons: number;
  latitude: number;
  longitude: number;
}
