import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { SUPPORTED_CROPS, CROP_LIST } from '../../config/crops';
import { CropType } from '../../types';
import { navigate } from '../../utils/navigation';
import {
  Sprout,
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const RegisterCropPage: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const { registerCrop } = useAppData();
  const { showToast } = useToast();

  const [cropType, setCropType] = useState<CropType>('Sugarcane');
  const [variety, setVariety] = useState<string>('Co 86032');
  const [landArea, setLandArea] = useState<number>(3.5);
  const [landUnit, setLandUnit] = useState<'Acres' | 'Hectares' | 'Bigha' | 'Guntha'>('Acres');
  const [sowingDate, setSowingDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [expectedHarvestDate, setExpectedHarvestDate] = useState<string>(
    new Date(Date.now() + 270 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [village, setVillage] = useState<string>(
    farmerProfile?.village || 'Kasaba Bavada'
  );
  const [district, setDistrict] = useState<string>(
    farmerProfile?.district || 'Kolhapur'
  );
  const [state, setState] = useState<string>(
    farmerProfile?.state || 'Maharashtra'
  );
  const [notes, setNotes] = useState<string>(
    'Well drained fertile plot with drip irrigation. Pre-monsoon sowing.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCropId, setSubmittedCropId] = useState<string | null>(null);

  const selectedCropMeta = SUPPORTED_CROPS[cropType];

  const handleCropTypeChange = (newType: CropType) => {
    setCropType(newType);
    const meta = SUPPORTED_CROPS[newType];
    if (meta && meta.varieties.length > 0) {
      setVariety(meta.varieties[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const created = await registerCrop({
        cropType,
        variety,
        landArea: Number(landArea),
        landUnit,
        sowingDate,
        expectedHarvestDate,
        village,
        district,
        state,
        notes,
      });

      setSubmittedCropId(created.id);
      showToast(`Crop registered successfully! Generated ID: ${created.id}`, 'success');
    } catch (err) {
      showToast('Failed to register crop. Please check details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EFE4] border border-[#DFD7C4] text-[#173522] text-xs font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97824]" />
          Simple Crop Onboarding
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#173522] tracking-tight">
          Register New Crop Plot
        </h2>
        <p className="text-xs font-sans text-[#777268] mt-1">
          Register crop and harvest details, then compare processors and book an intake slot directly.
        </p>
      </div>

      {/* Success View */}
      {submittedCropId ? (
        <div className="bg-white p-8 rounded-3xl border border-[#DFD7C4] shadow-xl text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-[#F3EFE4] border border-[#DFD7C4] text-[#173522] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-[#D97824]" />
          </div>

          <div>
            <span className="text-xs font-bold text-[#D97824] uppercase tracking-widest font-sans">
              Registration Successful
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#173522] mt-1">
              Crop ID: {submittedCropId}
            </h3>
            <p className="text-xs font-sans text-[#777268] mt-2 max-w-md mx-auto">
              Your <strong>{cropType}</strong> crop in {village}, {district} is now{' '}
              <span className="inline-block font-semibold text-[#D97824] bg-[#F3EFE4] border border-[#DFD7C4] px-2 py-0.5 rounded">
                Registered
              </span>
              {' '}and ready for processor comparison and intake booking.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#DFD7C4]">
            <button
              onClick={() => navigate('/farmer/crops')}
              className="px-5 py-2.5 bg-[#173522] hover:bg-[#244532] text-[#F3EFE4] rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              View My Crops
            </button>
            <button
              onClick={() => {
                setSubmittedCropId(null);
              }}
              className="px-5 py-2.5 bg-[#F3EFE4] hover:bg-[#EBE5D6] text-[#173522] border border-[#DFD7C4] rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Register Another Crop
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD7C4] shadow-xs space-y-6">
          {/* Part A: Crop & Variety Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#173522] tracking-wide flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#D97824]" />
              <span>Step 1: Crop &amp; Agronomic Classification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#173522] font-sans block mb-1">Select Crop Sector</label>
                <select
                  value={cropType}
                  onChange={(e) => handleCropTypeChange(e.target.value as CropType)}
                  className="w-full text-xs p-3 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 font-semibold text-[#171713] focus:bg-white focus:ring-2 focus:ring-[#173522]"
                >
                  {CROP_LIST.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop} ({SUPPORTED_CROPS[crop].industry})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-[#777268] mt-1 block font-sans">
                  Industry: {selectedCropMeta.industry} • Benchmark MSP: ₹{selectedCropMeta.benchmarkPricePerKg.toFixed(2)}/kg
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#173522] font-sans block mb-1">
                  Crop Variety / Hybrid
                </label>
                <select
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 font-semibold text-[#171713] focus:bg-white focus:ring-2 focus:ring-[#173522]"
                >
                  {selectedCropMeta.varieties.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 font-sans">
              <div>
                <label className="text-xs font-bold text-[#173522] block mb-1">Cultivated Land Area</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] font-mono font-bold text-[#171713]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#173522] block mb-1">Area Unit</label>
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
                >
                  <option value="Acres">Acres</option>
                  <option value="Hectares">Hectares</option>
                  <option value="Bigha">Bigha</option>
                  <option value="Guntha">Guntha</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div>
                <label className="text-xs font-bold text-[#173522] block mb-1">Sowing Date</label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#173522] block mb-1">
                  Expected Harvest Window
                </label>
                <input
                  type="date"
                  value={expectedHarvestDate}
                  onChange={(e) => setExpectedHarvestDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Part B: Field Location Information */}
          <div className="space-y-4 pt-4 border-t border-[#DFD7C4]">
            <h3 className="text-sm font-serif font-bold text-[#173522] tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#173522]" />
              <span>Step 2: Field Location &amp; Survey Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
              <div>
                <label className="text-xs font-bold text-[#173522] block mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#173522] block mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#173522] block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
                  required
                />
              </div>
            </div>

            <div className="font-sans">
              <label className="text-xs font-bold text-[#173522] block mb-1">
                Optional Field Notes (Irrigation, soil type, previous crop)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Flood irrigated deep black soil. No chemical residues."
                className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white focus:ring-2 focus:ring-[#173522] text-[#171713]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#DFD7C4] flex items-center justify-between font-sans">
            <button
              type="button"
              onClick={() => navigate('/farmer/crops')}
              className="text-xs font-semibold text-[#777268] hover:text-[#173522] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#173522] hover:bg-[#244532] text-[#F3EFE4] rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Registering Crop...</span>
              ) : (
                <>
                  <span>Submit Crop Registration</span>
                  <ArrowRight className="w-4 h-4 text-[#D97824]" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
