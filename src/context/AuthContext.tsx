import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, FarmerProfile } from '../types';
import {
  initializeStorage,
  resetStorageToDefaults,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  getStoredUsers,
  saveStoredUsers,
  getStoredFarmerProfiles,
  saveFarmerProfile,
} from '../services/storage';
import { navigate } from '../utils/navigation';

interface AuthContextType {
  currentUser: User | null;
  farmerProfile: FarmerProfile | null;
  isAuthenticated: boolean;
  login: (identifier: string, role?: UserRole) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginAsDemo: (role: UserRole) => Promise<{ success: boolean; user: User }>;
  signup: (data: { name: string; email: string; role: UserRole; phone: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateFarmerProfile: (updated: Partial<FarmerProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Synchronous state initialization from storage to avoid redirect loops on first render
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    initializeStorage();
    return getStoredCurrentUser();
  });

  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(() => {
    initializeStorage();
    const stored = getStoredCurrentUser();
    if (stored && stored.role === 'farmer') {
      const profiles = getStoredFarmerProfiles();
      return profiles[stored.id] || null;
    }
    return null;
  });

  // Sync state if storage changes across tabs or custom events
  useEffect(() => {
    const handleStorageChange = () => {
      const u = getStoredCurrentUser();
      setCurrentUser(u);
      if (u && u.role === 'farmer') {
        const profiles = getStoredFarmerProfiles();
        setFarmerProfile(profiles[u.id] || null);
      } else {
        setFarmerProfile(null);
      }
    };

    window.addEventListener('agrilink_data_changed', handleStorageChange);
    return () => window.removeEventListener('agrilink_data_changed', handleStorageChange);
  }, []);

  const login = async (
    identifier: string,
    role?: UserRole
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    initializeStorage();
    const cleanId = identifier.trim().toLowerCase();
    const cleanNumeric = identifier.replace(/[\s\-\+\(\)]/g, '');
    const users = getStoredUsers();

    // Match by email, formatted/raw phone, full name, id, or role keyword
    let matched = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/[\s\-\+\(\)]/g, '') === cleanNumeric ||
        u.name.toLowerCase() === cleanId ||
        u.id.toLowerCase() === cleanId ||
        (cleanId.length > 2 && u.role.toLowerCase() === cleanId)
    );

    // Fallback: match by selected role if provided and demo-friendly
    if (!matched && role) {
      matched = users.find((u) => u.role === role);
    }

    if (!matched) {
      return {
        success: false,
        error: 'Invalid credentials. User not found. Please check your details or select an SIH Judge Demo account.',
      };
    }

    saveStoredCurrentUser(matched);
    setCurrentUser(matched);

    if (matched.role === 'farmer') {
      const profiles = getStoredFarmerProfiles();
      setFarmerProfile(profiles[matched.id] || null);
    } else {
      setFarmerProfile(null);
    }

    return { success: true, user: matched };
  };

  const loginAsDemo = async (role: UserRole): Promise<{ success: boolean; user: User }> => {
    initializeStorage();
    let users = getStoredUsers();

    const roleDemoIds: Record<UserRole, string> = {
      farmer: 'farmer-1',
      officer: 'officer-1',
      factory: 'factory-1',
    };

    let target = users.find((u) => u.id === roleDemoIds[role]) || users.find((u) => u.role === role);

    if (!target) {
      resetStorageToDefaults();
      users = getStoredUsers();
      target = users.find((u) => u.id === roleDemoIds[role]) || users.find((u) => u.role === role)!;
    }

    saveStoredCurrentUser(target);
    setCurrentUser(target);

    if (target.role === 'farmer') {
      const profiles = getStoredFarmerProfiles();
      setFarmerProfile(profiles[target.id] || null);
    } else {
      setFarmerProfile(null);
    }

    return { success: true, user: target };
  };

  const signup = async ({
    name,
    email,
    role,
    phone,
  }: {
    name: string;
    email: string;
    role: UserRole;
    phone: string;
  }) => {
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      phone,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);
    saveStoredCurrentUser(newUser);
    setCurrentUser(newUser);

    if (role === 'farmer') {
      const newProfile: FarmerProfile = {
        userId: newUser.id,
        fullName: name,
        phone,
        address: '',
        village: '',
        district: '',
        state: '',
        preferredLanguage: 'English / Hindi',
        totalLandArea: 0,
        landUnit: 'Acres',
        completionPercentage: 40,
      };
      saveFarmerProfile(newProfile);
      setFarmerProfile(newProfile);
    }

    return { success: true };
  };

  const logout = () => {
    saveStoredCurrentUser(null);
    setCurrentUser(null);
    setFarmerProfile(null);
    navigate('/login');
  };

  const switchUser = (userId: string) => {
    const users = getStoredUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      saveStoredCurrentUser(user);
      setCurrentUser(user);
      if (user.role === 'farmer') {
        const profiles = getStoredFarmerProfiles();
        setFarmerProfile(profiles[user.id] || null);
      } else {
        setFarmerProfile(null);
      }
    }
  };

  const updateFarmerProfile = (updated: Partial<FarmerProfile>) => {
    if (!currentUser || currentUser.role !== 'farmer' || !farmerProfile) return;

    const merged: FarmerProfile = {
      ...farmerProfile,
      ...updated,
    };

    // Calculate dynamic completion percentage
    let filled = 0;
    const fields = [
      merged.fullName,
      merged.phone,
      merged.address,
      merged.village,
      merged.district,
      merged.state,
      merged.preferredLanguage,
      merged.totalLandArea > 0,
    ];
    fields.forEach((f) => {
      if (f) filled++;
    });
    merged.completionPercentage = Math.round((filled / fields.length) * 100);

    saveFarmerProfile(merged);
    setFarmerProfile(merged);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        farmerProfile,
        isAuthenticated: !!currentUser,
        login,
        loginAsDemo,
        signup,
        logout,
        switchUser,
        updateFarmerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
