import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CropRegistration,
  ProcurementRecord,
  InspectionReport,
  Notification,
  FactoryInfo,
  CropType,
  CropStatus,
  ProcurementStatus,
  QualityRecord,
  WeighmentRecord,
  TransportRecord,
} from '../types';
import {
  initializeStorage,
  getStoredCrops,
  saveCrop,
  getStoredProcurements,
  saveProcurement,
  getStoredInspections,
  saveInspection,
  getStoredNotifications,
  getStoredFactories,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  resetStorageToDefaults,
} from '../services/storage';
import { dispatchNotification } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface RegisterCropInput {
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
  imageUrl: string;
  latitude: number;
  longitude: number;
  locationAccuracy?: number;
}

interface AppDataContextType {
  crops: CropRegistration[];
  procurements: ProcurementRecord[];
  inspections: InspectionReport[];
  notifications: Notification[];
  factories: FactoryInfo[];
  registerCrop: (data: RegisterCropInput) => Promise<CropRegistration>;
  verifyCrop: (
    cropId: string,
    decision: 'Verified' | 'Rejected' | 'Re-verification Required',
    remarks: string,
    inspectionData?: Partial<InspectionReport>
  ) => Promise<void>;
  scheduleProcurement: (data: {
    cropRegistrationId: string;
    factoryId: string;
    scheduledDate: string;
    harvestDate: string;
    batchNumber: string;
    priority?: 'Normal' | 'High' | 'Urgent';
  }) => Promise<ProcurementRecord>;
  assignTransport: (
    procurementId: string,
    transportData: Omit<TransportRecord, 'id' | 'assignedAt'>
  ) => Promise<void>;
  updateTransportStatus: (
    procurementId: string,
    status: TransportRecord['status']
  ) => Promise<void>;
  recordQualityAndWeighment: (
    procurementId: string,
    quality: Omit<QualityRecord, 'id' | 'checkedAt'>,
    weighment: Omit<WeighmentRecord, 'id' | 'netWeightKg' | 'weighmentDate'>
  ) => Promise<void>;
  generateBill: (procurementId: string, ratePerKg: number) => Promise<void>;
  markPaymentPaid: (procurementId: string, transactionRef?: string) => Promise<void>;
  advanceProcurementStage: (
    procurementId: string,
    targetStatus: ProcurementStatus,
    notes?: string
  ) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetAllData: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [crops, setCrops] = useState<CropRegistration[]>(() => {
    initializeStorage();
    return getStoredCrops();
  });
  const [procurements, setProcurements] = useState<ProcurementRecord[]>(() => {
    initializeStorage();
    return getStoredProcurements();
  });
  const [inspections, setInspections] = useState<InspectionReport[]>(() => {
    initializeStorage();
    return getStoredInspections();
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    initializeStorage();
    return getStoredNotifications();
  });
  const [factories, setFactories] = useState<FactoryInfo[]>(() => {
    initializeStorage();
    return getStoredFactories();
  });

  const loadData = () => {
    setCrops(getStoredCrops());
    setProcurements(getStoredProcurements());
    setInspections(getStoredInspections());
    setNotifications(getStoredNotifications());
    setFactories(getStoredFactories());
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('agrilink_data_changed', handleSync);
    return () => window.removeEventListener('agrilink_data_changed', handleSync);
  }, []);

  const registerCrop = async (data: RegisterCropInput): Promise<CropRegistration> => {
    const existingCount = crops.length;
    const newId = `AGRI-CROP-2026-${String(existingCount + 1).padStart(4, '0')}`;

    const newCrop: CropRegistration = {
      id: newId,
      farmerId: currentUser?.id || 'farmer-1',
      farmerName: currentUser?.name || 'Ramesh Patel',
      farmerPhone: currentUser?.phone || '+91 98220 14589',
      cropType: data.cropType,
      variety: data.variety,
      landArea: Number(data.landArea),
      landUnit: data.landUnit,
      sowingDate: data.sowingDate,
      expectedHarvestDate: data.expectedHarvestDate,
      village: data.village,
      district: data.district,
      state: data.state,
      notes: data.notes,
      status: 'Pending Verification',
      registrationDate: new Date().toISOString(),
      imageUrl: data.imageUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      locationAccuracy: data.locationAccuracy,
      capturedAt: new Date().toISOString(),
    };

    saveCrop(newCrop);

    // Notify Field Officers
    dispatchNotification({
      recipientUserId: 'officer-1',
      recipientRole: 'officer',
      title: 'New Crop Awaiting Verification',
      message: `${newCrop.farmerName} registered ${newCrop.cropType} (${newCrop.id}) in ${newCrop.village}, ${newCrop.district}.`,
      category: 'crop',
      linkUrl: '/officer/verification',
    });

    // Notify Farmer confirmation (In-app + SMS)
    dispatchNotification({
      recipientUserId: newCrop.farmerId,
      recipientRole: 'farmer',
      recipientPhone: newCrop.farmerPhone,
      sendSms: true,
      title: 'Crop Registered Successfully ✓',
      message: `Your ${newCrop.cropType} (${newCrop.id}) was submitted with geotagged proof. Pending field officer inspection.`,
      category: 'crop',
      linkUrl: '/farmer/crops',
    });

    return newCrop;
  };

  const verifyCrop = async (
    cropId: string,
    decision: 'Verified' | 'Rejected' | 'Re-verification Required',
    remarks: string,
    inspectionData?: Partial<InspectionReport>
  ) => {
    const targetCrop = crops.find((c) => c.id === cropId);
    if (!targetCrop) return;

    let reportId: string | undefined;

    if (decision === 'Verified' && inspectionData) {
      reportId = `REP-2026-${String(inspections.length + 1).padStart(4, '0')}`;
      const newReport: InspectionReport = {
        id: reportId,
        cropRegistrationId: cropId,
        officerId: currentUser?.id || 'officer-1',
        officerName: currentUser?.name || 'Rajesh Sharma (Agronomist)',
        cropCondition: inspectionData.cropCondition || 'Good',
        fieldCondition: inspectionData.fieldCondition || 'Field boundaries and GPS verified.',
        pestInfestationRisk: inspectionData.pestInfestationRisk || 'Low',
        soilMoistureCondition: inspectionData.soilMoistureCondition || 'Adequate',
        estimatedYieldPerAcre: inspectionData.estimatedYieldPerAcre || inspectionData.estimatedYieldPerAcreKg || 25000,
        estimatedYieldPerAcreKg: inspectionData.estimatedYieldPerAcreKg || inspectionData.estimatedYieldPerAcre || 25000,
        verificationRemarks: remarks,
        inspectionDate: new Date().toISOString(),
      };
      saveInspection(newReport);
    }

    const updatedCrop: CropRegistration = {
      ...targetCrop,
      status: decision,
      verificationDate: new Date().toISOString(),
      verifiedByOfficerId: currentUser?.id || 'officer-1',
      verifiedByOfficerName: currentUser?.name || 'Rajesh Sharma (Agronomist)',
      officerRemarks: remarks,
      rejectionReason: decision === 'Rejected' ? remarks : undefined,
      inspectionReportId: reportId || targetCrop.inspectionReportId,
    };

    saveCrop(updatedCrop);

    // Notify the Farmer (In-App + SMS + IVR)
    dispatchNotification({
      recipientUserId: targetCrop.farmerId,
      recipientRole: 'farmer',
      recipientPhone: targetCrop.farmerPhone,
      sendSms: true,
      sendIvr: decision === 'Verified',
      title:
        decision === 'Verified'
          ? 'Crop Verified by Field Officer ✓'
          : `Crop ${decision}`,
      message:
        decision === 'Verified'
          ? `Your ${targetCrop.cropType} (${targetCrop.id}) has been approved and is now eligible for factory procurement.`
          : `Officer Remarks: ${remarks}`,
      category: 'verification',
      linkUrl: '/farmer/crops',
    });
  };

  const scheduleProcurement = async (data: {
    cropRegistrationId: string;
    factoryId: string;
    scheduledDate: string;
    harvestDate: string;
    batchNumber: string;
    priority?: 'Normal' | 'High' | 'Urgent';
  }): Promise<ProcurementRecord> => {
    const crop = crops.find((c) => c.id === data.cropRegistrationId);
    if (!crop) throw new Error('Crop not found');

    const factory = factories.find((f) => f.id === data.factoryId) || factories[0];

    const newProcurement: ProcurementRecord = {
      id: `PROC-2026-${String(procurements.length + 1001)}`,
      cropRegistrationId: crop.id,
      farmerId: crop.farmerId,
      farmerName: crop.farmerName,
      farmerPhone: crop.farmerPhone,
      factoryId: factory.id,
      factoryName: factory.name,
      cropType: crop.cropType,
      variety: crop.variety,
      landArea: crop.landArea,
      landUnit: crop.landUnit,
      currentStatus: 'Procurement Scheduled',
      scheduledDate: data.scheduledDate,
      harvestDate: data.harvestDate,
      batchNumber: data.batchNumber,
      priority: data.priority || 'Normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Crop Registered',
          timestamp: crop.registrationDate,
          updatedBy: crop.farmerName,
          notes: 'Crop submitted with geotagged evidence.',
        },
        {
          status: 'Field Verified',
          timestamp: crop.verificationDate || new Date().toISOString(),
          updatedBy: crop.verifiedByOfficerName || 'Field Officer',
          notes: crop.officerRemarks || 'Field verified.',
        },
        {
          status: 'Procurement Scheduled',
          timestamp: new Date().toISOString(),
          updatedBy: factory.name,
          notes: `Scheduled for ${data.scheduledDate} (Batch: ${data.batchNumber}).`,
        },
      ],
    };

    saveProcurement(newProcurement);

    // Notify Farmer
    dispatchNotification({
      recipientUserId: crop.farmerId,
      recipientRole: 'farmer',
      recipientPhone: crop.farmerPhone,
      sendSms: true,
      title: 'Procurement Scheduled!',
      message: `${factory.name} scheduled procurement of your ${crop.cropType} for ${data.scheduledDate}. Batch: ${data.batchNumber}.`,
      category: 'procurement',
      linkUrl: '/farmer/procurement',
    });

    return newProcurement;
  };

  const assignTransport = async (
    procurementId: string,
    transportData: Omit<TransportRecord, 'id' | 'assignedAt'>
  ) => {
    const proc = procurements.find((p) => p.id === procurementId);
    if (!proc) return;

    const transport: TransportRecord = {
      ...transportData,
      id: `TR-${Date.now().toString().slice(-4)}`,
      assignedAt: new Date().toISOString(),
    };

    const updated: ProcurementRecord = {
      ...proc,
      currentStatus: 'Transport Assigned',
      transport,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...proc.statusHistory,
        {
          status: 'Transport Assigned',
          timestamp: new Date().toISOString(),
          updatedBy: proc.factoryName,
          notes: `Assigned vehicle ${transport.vehicleNumber} (Driver: ${transport.driverName}).`,
        },
      ],
    };

    saveProcurement(updated);

    // Notify Farmer
    dispatchNotification({
      recipientUserId: proc.farmerId,
      recipientRole: 'farmer',
      recipientPhone: proc.farmerPhone,
      sendSms: true,
      title: 'Transport Assigned for Pickup',
      message: `Vehicle ${transport.vehicleNumber} driven by ${transport.driverName} (${transport.driverPhone}) assigned for pickup on ${transport.pickupDate}.`,
      category: 'transport',
      linkUrl: '/farmer/procurement',
    });
  };

  const updateTransportStatus = async (
    procurementId: string,
    status: TransportRecord['status']
  ) => {
    const proc = procurements.find((p) => p.id === procurementId);
    if (!proc || !proc.transport) return;

    const updatedTransport: TransportRecord = {
      ...proc.transport,
      status,
    };

    let targetProcStatus = proc.currentStatus;
    if (status === 'In Transit') targetProcStatus = 'In Transit';
    if (status === 'Arrived') targetProcStatus = 'Arrived at Procurement Center';
    if (status === 'Completed') targetProcStatus = 'Quality Check';

    const updated: ProcurementRecord = {
      ...proc,
      currentStatus: targetProcStatus,
      transport: updatedTransport,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...proc.statusHistory,
        {
          status: targetProcStatus,
          timestamp: new Date().toISOString(),
          updatedBy: `${proc.transport.driverName} / Factory Logistics`,
          notes: `Logistics status updated to: ${status}`,
        },
      ],
    };

    saveProcurement(updated);

    // Notify Farmer
    dispatchNotification({
      recipientUserId: proc.farmerId,
      recipientRole: 'farmer',
      recipientPhone: proc.farmerPhone,
      sendSms: true,
      title: `Produce Transport: ${status}`,
      message: `Your produce is currently: ${status}. Destination: ${proc.transport.destination}`,
      category: 'transport',
      linkUrl: '/farmer/procurement',
    });
  };

  const recordQualityAndWeighment = async (
    procurementId: string,
    quality: Omit<QualityRecord, 'id' | 'checkedAt'>,
    weighment: Omit<WeighmentRecord, 'id' | 'netWeightKg' | 'weighmentDate'>
  ) => {
    const proc = procurements.find((p) => p.id === procurementId);
    if (!proc) return;

    const netWeight = Math.max(0, weighment.grossWeightKg - weighment.tareWeightKg);

    const qualityRec: QualityRecord = {
      ...quality,
      id: `QUAL-${Date.now().toString().slice(-4)}`,
      checkedAt: new Date().toISOString(),
    };

    const weighmentRec: WeighmentRecord = {
      ...weighment,
      id: `WEIGH-${Date.now().toString().slice(-4)}`,
      netWeightKg: netWeight,
      weighmentDate: new Date().toISOString(),
    };

    const updated: ProcurementRecord = {
      ...proc,
      currentStatus: 'Accepted',
      quality: qualityRec,
      weighment: weighmentRec,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...proc.statusHistory,
        {
          status: 'Quality Check',
          timestamp: new Date().toISOString(),
          updatedBy: quality.checkedBy,
          notes: `Quality graded as ${quality.grade}. Remarks: ${quality.remarks}`,
        },
        {
          status: 'Weighment',
          timestamp: new Date().toISOString(),
          updatedBy: weighment.scaleOperator,
          notes: `Gross: ${weighment.grossWeightKg} kg, Tare: ${weighment.tareWeightKg} kg, Certified Net: ${netWeight} kg.`,
        },
        {
          status: 'Accepted',
          timestamp: new Date().toISOString(),
          updatedBy: proc.factoryName,
          notes: `Consignment accepted for processing. Net weight: ${netWeight} kg.`,
        },
      ],
    };

    saveProcurement(updated);

    // Notify Farmer
    dispatchNotification({
      recipientUserId: proc.farmerId,
      recipientRole: 'farmer',
      recipientPhone: proc.farmerPhone,
      sendSms: true,
      title: 'Quality & Weighment Completed ✓',
      message: `Graded ${quality.grade}. Net Weight certified: ${netWeight} kg (${(netWeight / 1000).toFixed(2)} MT).`,
      category: 'quality',
      linkUrl: '/farmer/procurement',
    });
  };

  const generateBill = async (procurementId: string, ratePerKg: number) => {
    const proc = procurements.find((p) => p.id === procurementId);
    if (!proc || !proc.weighment) return;

    const netWeight = proc.weighment.netWeightKg;
    const totalAmount = Math.round(netWeight * ratePerKg);
    const billNumber = `INV-AGRI-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

    const billRecord = {
      id: `BILL-${Date.now().toString().slice(-4)}`,
      billNumber,
      date: new Date().toISOString().split('T')[0],
      quantityKg: netWeight,
      ratePerKg,
      totalAmount,
      paymentStatus: 'Pending' as const,
    };

    const updated: ProcurementRecord = {
      ...proc,
      currentStatus: 'Billing',
      bill: billRecord,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...proc.statusHistory,
        {
          status: 'Billing',
          timestamp: new Date().toISOString(),
          updatedBy: `${proc.factoryName} Accounts Section`,
          notes: `Generated Bill ${billNumber} for ${netWeight} kg @ ₹${ratePerKg}/kg = ₹${totalAmount.toLocaleString('en-IN')}.`,
        },
      ],
    };

    saveProcurement(updated);

    // Notify Farmer
    dispatchNotification({
      recipientUserId: proc.farmerId,
      recipientRole: 'farmer',
      recipientPhone: proc.farmerPhone,
      sendSms: true,
      title: `Digital Bill Generated: ₹${totalAmount.toLocaleString('en-IN')}`,
      message: `Bill ${billNumber} generated by ${proc.factoryName}. Total amount: ₹${totalAmount.toLocaleString('en-IN')}.`,
      category: 'payment',
      linkUrl: '/farmer/procurement',
    });
  };

  const markPaymentPaid = async (procurementId: string, transactionRef?: string) => {
    const proc = procurements.find((p) => p.id === procurementId);
    if (!proc || !proc.bill) return;

    const txn =
      transactionRef ||
      `RTGS/SBI/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/${Math.floor(10000000 + Math.random() * 90000000)}`;

    const updatedBill = {
      ...proc.bill,
      paymentStatus: 'Paid' as const,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionRef: txn,
    };

    const updated: ProcurementRecord = {
      ...proc,
      currentStatus: 'Completed',
      bill: updatedBill,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...proc.statusHistory,
        {
          status: 'Payment Processed',
          timestamp: new Date().toISOString(),
          updatedBy: `${proc.factoryName} Direct Treasury`,
          notes: `Payment of ₹${proc.bill.totalAmount.toLocaleString('en-IN')} released via ${txn}.`,
        },
        {
          status: 'Completed',
          timestamp: new Date().toISOString(),
          updatedBy: 'AgriLink System',
          notes: 'Procurement cycle completed with full digital ledger trail.',
        },
      ],
    };

    saveProcurement(updated);

    // Notify Farmer (SMS + IVR + In-App)
    dispatchNotification({
      recipientUserId: proc.farmerId,
      recipientRole: 'farmer',
      recipientPhone: proc.farmerPhone,
      sendSms: true,
      sendIvr: true,
      title: `Payment Received: ₹${proc.bill.totalAmount.toLocaleString('en-IN')} ✓`,
      message: `Amount ₹${proc.bill.totalAmount.toLocaleString('en-IN')} credited to your bank account. UTR Ref: ${txn}.`,
      category: 'payment',
      linkUrl: '/farmer/procurement',
    });
  };

  const advanceProcurementStage = async (
    procurementId: string,
    targetStatus: ProcurementStatus,
    notes?: string
  ) => {
    const proc = procurements.find((p) => p.id === procurementId);
    if (!proc) return;

    const updated: ProcurementRecord = {
      ...proc,
      currentStatus: targetStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        ...proc.statusHistory,
        {
          status: targetStatus,
          timestamp: new Date().toISOString(),
          updatedBy: currentUser?.name || 'System Operator',
          notes: notes || `Status updated to ${targetStatus}.`,
        },
      ],
    };

    saveProcurement(updated);

    dispatchNotification({
      recipientUserId: proc.farmerId,
      recipientRole: 'farmer',
      recipientPhone: proc.farmerPhone,
      sendSms: true,
      title: `Procurement Status: ${targetStatus}`,
      message: `${proc.cropType} (${proc.id}): ${notes || targetStatus}`,
      category: 'procurement',
      linkUrl: '/farmer/procurement',
    });
  };

  const markNotificationRead = (id: string) => {
    markNotificationAsRead(id);
  };

  const markAllNotificationsRead = () => {
    if (currentUser) {
      markAllNotificationsAsRead(currentUser.id);
    }
  };

  const resetAllData = () => {
    resetStorageToDefaults();
  };

  return (
    <AppDataContext.Provider
      value={{
        crops,
        procurements,
        inspections,
        notifications,
        factories,
        registerCrop,
        verifyCrop,
        scheduleProcurement,
        assignTransport,
        updateTransportStatus,
        recordQualityAndWeighment,
        generateBill,
        markPaymentPaid,
        advanceProcurementStage,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within an AppDataProvider');
  return context;
};
