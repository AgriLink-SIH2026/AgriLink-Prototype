import {
  User,
  FarmerProfile,
  CropRegistration,
  ProcurementRecord,
  InspectionReport,
  Notification,
  FactoryInfo,
} from '../types';
import {
  SEED_USERS,
  SEED_FARMER_PROFILES,
  SEED_FACTORIES,
  SEED_CROPS,
  SEED_PROCUREMENTS,
  SEED_INSPECTION_REPORTS,
  SEED_NOTIFICATIONS,
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'agrilink_users_v2',
  CURRENT_USER: 'agrilink_current_user_v2',
  FARMER_PROFILES: 'agrilink_farmer_profiles_v1',
  FACTORIES: 'agrilink_factories_v1',
  CROPS: 'agrilink_crops_v4',
  PROCUREMENTS: 'agrilink_procurements_v3',
  INSPECTIONS: 'agrilink_inspections_v2',
  NOTIFICATIONS: 'agrilink_notifications_v3',
};

// Initialize default storage with seed data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FARMER_PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.FARMER_PROFILES, JSON.stringify(SEED_FARMER_PROFILES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FACTORIES)) {
    localStorage.setItem(STORAGE_KEYS.FACTORIES, JSON.stringify(SEED_FACTORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(SEED_CROPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROCUREMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PROCUREMENTS, JSON.stringify(SEED_PROCUREMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INSPECTIONS)) {
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(SEED_INSPECTION_REPORTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  }
};

export const resetStorageToDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
  localStorage.setItem(STORAGE_KEYS.FARMER_PROFILES, JSON.stringify(SEED_FARMER_PROFILES));
  localStorage.setItem(STORAGE_KEYS.FACTORIES, JSON.stringify(SEED_FACTORIES));
  localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(SEED_CROPS));
  localStorage.setItem(STORAGE_KEYS.PROCUREMENTS, JSON.stringify(SEED_PROCUREMENTS));
  localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(SEED_INSPECTION_REPORTS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  window.dispatchEvent(new Event('agrilink_data_changed'));
};

// Generic Helpers
function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('agrilink_data_changed'));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// User & Auth Storage
export const getStoredUsers = (): User[] => getItem(STORAGE_KEYS.USERS, SEED_USERS);
export const saveStoredUsers = (users: User[]) => setItem(STORAGE_KEYS.USERS, users);

export const getStoredCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw || raw === 'null' || raw === 'undefined') return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading current user from storage:', err);
    return null;
  }
};
export const saveStoredCurrentUser = (user: User | null) =>
  setItem(STORAGE_KEYS.CURRENT_USER, user);

// Farmer Profile Storage
export const getStoredFarmerProfiles = (): Record<string, FarmerProfile> =>
  getItem(STORAGE_KEYS.FARMER_PROFILES, SEED_FARMER_PROFILES);
export const saveFarmerProfile = (profile: FarmerProfile) => {
  const profiles = getStoredFarmerProfiles();
  profiles[profile.userId] = profile;
  setItem(STORAGE_KEYS.FARMER_PROFILES, profiles);
};

// Factories Storage
export const getStoredFactories = (): FactoryInfo[] =>
  getItem(STORAGE_KEYS.FACTORIES, SEED_FACTORIES);

// Crops Storage
export const getStoredCrops = (): CropRegistration[] =>
  getItem(STORAGE_KEYS.CROPS, SEED_CROPS);
export const saveCrop = (crop: CropRegistration) => {
  const crops = getStoredCrops();
  const existingIdx = crops.findIndex((c) => c.id === crop.id);
  if (existingIdx >= 0) {
    crops[existingIdx] = crop;
  } else {
    crops.unshift(crop);
  }
  setItem(STORAGE_KEYS.CROPS, crops);
};

// Procurements Storage
export const getStoredProcurements = (): ProcurementRecord[] =>
  getItem(STORAGE_KEYS.PROCUREMENTS, SEED_PROCUREMENTS);
export const saveProcurement = (record: ProcurementRecord) => {
  const records = getStoredProcurements();
  const existingIdx = records.findIndex((r) => r.id === record.id);
  if (existingIdx >= 0) {
    records[existingIdx] = record;
  } else {
    records.unshift(record);
  }
  setItem(STORAGE_KEYS.PROCUREMENTS, records);
};

// Inspections Storage
export const getStoredInspections = (): InspectionReport[] =>
  getItem(STORAGE_KEYS.INSPECTIONS, SEED_INSPECTION_REPORTS);
export const saveInspection = (report: InspectionReport) => {
  const reports = getStoredInspections();
  const existingIdx = reports.findIndex((r) => r.id === report.id);
  if (existingIdx >= 0) {
    reports[existingIdx] = report;
  } else {
    reports.unshift(report);
  }
  setItem(STORAGE_KEYS.INSPECTIONS, reports);
};

// Notifications Storage
export const getStoredNotifications = (): Notification[] =>
  getItem(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
export const saveNotification = (notif: Notification) => {
  const notifs = getStoredNotifications();
  notifs.unshift(notif);
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
};
export const markNotificationAsRead = (notifId: string) => {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
};
export const markAllNotificationsAsRead = (userId: string) => {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => (n.recipientUserId === userId ? { ...n, isRead: true } : n));
  setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
};
