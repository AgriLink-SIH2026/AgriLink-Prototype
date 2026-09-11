import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, MapPin, Globe, Save, CheckCircle2, Award } from 'lucide-react';

export const FarmerProfile: React.FC = () => {
  const { currentUser, farmerProfile, updateFarmerProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(
    farmerProfile?.fullName || currentUser?.name || 'Ramesh Patel'
  );
  const [phone, setPhone] = useState(farmerProfile?.phone || currentUser?.phone || '+91 98220 14589');
  const [address, setAddress] = useState(
    farmerProfile?.address || 'Gat No. 142, Kasaba Bavada Road'
  );
  const [village, setVillage] = useState(farmerProfile?.village || 'Kasaba Bavada');
  const [district, setDistrict] = useState(farmerProfile?.district || 'Kolhapur');
  const [state, setState] = useState(farmerProfile?.state || 'Maharashtra');
  const [preferredLanguage, setPreferredLanguage] = useState(
    farmerProfile?.preferredLanguage || 'Marathi / English'
  );
  const [totalLandArea, setTotalLandArea] = useState(farmerProfile?.totalLandArea || 8.5);
  const [landUnit, setLandUnit] = useState(farmerProfile?.landUnit || 'Acres');
  const [isSaving, setIsSaving] = useState(false);

  const completion = farmerProfile?.completionPercentage || 85;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      updateFarmerProfile({
        fullName,
        phone,
        address,
        village,
        district,
        state,
        preferredLanguage,
        totalLandArea: Number(totalLandArea),
        landUnit,
      });
      showToast('Farmer profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card with completion meter */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD7C4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#173522] border border-[#244532] text-[#F3EFE4] flex items-center justify-center font-serif font-bold text-2xl shrink-0 shadow-xs">
            {fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#173522] bg-[#F3EFE4] px-2.5 py-0.5 rounded-full mb-1 border border-[#DFD7C4] font-sans font-semibold">
              <CheckCircle2 className="w-3 h-3 text-[#D97824]" />
              Verified AgriLink Farmer Identity
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#173522]">{fullName}</h2>
            <p className="text-xs text-[#777268] font-sans mt-0.5">
              Registered Farmer • {village}, {district}
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#F3EFE4] rounded-2xl border border-[#DFD7C4] min-w-[200px] font-sans">
          <div className="flex items-center justify-between text-xs font-bold text-[#173522] mb-1.5">
            <span>Profile Completion</span>
            <span className="text-[#D97824]">{completion}%</span>
          </div>
          <div className="w-full bg-[#DFD7C4] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#D97824] h-full rounded-full transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
          <span className="text-[10px] text-[#777268] mt-1.5 block">
            {completion === 100 ? 'All information complete!' : 'Fill missing village details'}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD7C4] shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#173522]">Personal &amp; Contact Details</h3>
          <p className="text-xs text-[#777268] font-sans mt-0.5">
            These details are shared with authorized Field Officers and Sugar/Cotton/Oilseed mills during procurement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#777268] absolute left-3.5 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:ring-2 focus:ring-[#173522] focus:outline-none text-[#171713]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">
              Mobile Phone (For SMS/IVR Dispatch)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#777268] absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white font-mono focus:ring-2 focus:ring-[#173522] focus:outline-none text-[#171713]"
                required
              />
            </div>
          </div>
        </div>

        <div className="font-sans">
          <label className="text-xs font-bold text-[#173522] block mb-1">Farm / Residential Address</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#777268] absolute left-3.5 top-3" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:ring-2 focus:ring-[#173522] focus:outline-none text-[#171713]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">Village / Gram Panchayat</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DFD7C4] font-sans">
          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">Preferred Language</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#777268] absolute left-3.5 top-3" />
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white text-[#171713]"
              >
                <option value="English / Hindi">English / Hindi</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi / English">Marathi (मराठी)</option>
                <option value="Punjabi / English">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="Kannada / English">Kannada (ಕನ್ನಡ)</option>
                <option value="Gujarati / English">Gujarati (ગુજરાતી)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">Total Holding Area</label>
            <input
              type="number"
              step="0.1"
              value={totalLandArea}
              onChange={(e) => setTotalLandArea(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white font-mono font-bold text-[#171713]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#173522] block mb-1">Land Measurement Unit</label>
            <select
              value={landUnit}
              onChange={(e) => setLandUnit(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white text-[#171713]"
            >
              <option value="Acres">Acres</option>
              <option value="Hectares">Hectares</option>
              <option value="Bigha">Bigha</option>
              <option value="Guntha">Guntha</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DFD7C4] flex justify-end font-sans">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#173522] hover:bg-[#244532] text-[#F3EFE4] rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#D97824]" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
