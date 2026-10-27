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

// Explicit support for cash crops (Sugarcane, Cotton, Soybean)
// alongside standard grains (Wheat, Rice, Maize). NO Spices included.
export type CropType =
  | 'Sugarcane'
  | 'Cotton'
  | 'Soybean'
  | 'Wheat'
  | 'Rice'
  | 'Maize'
  | 'Mustard'
  | 'Sunflower'
  | 'Groundnut'
  | 'Tea'
  | 'Coffee';

export type CropStatus =
  | 'Registered'
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected'
  | 'Re-verification Required';

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

// 24-Hour Slot Management & Booking Types
export type SlotStatus = 'BOOKED' | 'RELEASED' | 'COMPLETED' | 'CANCELLED';

export interface Slot {
  id: string;
  factoryId: string;
  factoryName: string;
  cropType: CropType;
  slotStart: string; // ISO 8601
  slotEnd: string; // ISO 8601 (Strict 24-hour window)
  totalCapacityTons: number;
  availableCapacityTons: number;
  status: 'AVAILABLE' | 'FULL' | 'CLOSED';
  createdAt: string;
}

export interface Booking {
  id: string;
  slotId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropRegistrationId?: string;
  cropType: CropType;
  quantityTons: number;
  bookingTime: string; // ISO 8601
  harvestDate: string; // YYYY-MM-DD
  slotStart: string; // ISO 8601
  slotEnd: string; // ISO 8601 (Strict 24-hour window)
  slotStatus: SlotStatus;
  vehicleNumber: string | null; // Nullable on creation; mandatory >= 6h prior to slotStart
  digitalSlipId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QRCodePayload {
  slip_id: string;
  farmer_id: string;
  slot_time: string;
  crop_type: string;
  vehicle_number: string | null;
}

export interface DigitalSlip {
  id: string;
  slipId: string; // e.g. SLIP-2026-1042
  bookingId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropType: CropType;
  quantityTons: number;
  factoryName: string;
  slotStart: string;
  slotEnd: string;
  vehicleNumber: string | null;
  qrCodePayload: QRCodePayload;
  createdAt: string;
}

export interface FactoryPriceComparison {
  factoryId: string;
  factoryName: string;
  district: string;
  state: string;
  distanceKm: number;
  cropType: CropType;
  buyingRatePerQuintal: number; // In INR
  buyingRatePerKg: number; // In INR
  dailyIntakeCapacityTons: number;
  nextAvailableSlotStart: string;
  slotId: string;
  contactPhone: string;
  lastUpdated: string;
}

export type ProcurementStatus =
  | 'Crop Registered'
  | 'Field Verified'
  | 'Procurement Pending'
  | 'Procurement Scheduled'
  | 'Harvest Scheduled'
  | 'Transport Assigned'
  | 'In Transit'
  | 'Arrived at Procurement Center'
  | 'Quality Check'
  | 'Weighment'
  | 'Accepted'
  | 'Billing'
  | 'Payment Processed'
  | 'Completed';

export interface TransportRecord {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  pickupDate: string;
  pickupLocation: string;
  destination: string;
  status: 'Not Assigned' | 'Assigned' | 'In Transit' | 'Arrived' | 'Completed';
  assignedAt: string;
}

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
  bookingId?: string;
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
  transport?: TransportRecord;
  quality?: QualityRecord;
  weighment?: WeighmentRecord;
  bill?: BillRecord;
  statusHistory: StatusHistoryItem[];
}

// Deprecated Field Officer Inspection Report (maintained only for type compatibility)
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
  recipientRole: UserRole | 'officer';
  title: string;
  message: string;
  category: 'crop' | 'verification' | 'procurement' | 'transport' | 'quality' | 'payment' | 'system' | 'slot';
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
  industryType: 'Sugar' | 'Textile' | 'Oilseed' | 'Tea & Coffee' | 'Grain Processing';
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
