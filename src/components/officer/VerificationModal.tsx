import React, { useState } from 'react';
import { CropRegistration } from '../../types';
import { Modal } from '../common/Modal';
import { MapView } from '../common/MapView';
import { StatusBadge } from '../common/StatusBadge';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Phone,
  FileCheck,
  Camera,
} from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: CropRegistration;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  crop,
}) => {
  const { verifyCrop } = useAppData();
  const { showToast } = useToast();

  const [decision, setDecision] = useState<'Verified' | 'Rejected' | 'Re-verification Required'>('Verified');
  const [remarks, setRemarks] = useState('');
  const [cropCondition, setCropCondition] = useState<'Excellent' | 'Good' | 'Average' | 'Poor'>('Good');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((decision === 'Rejected' || decision === 'Re-verification Required') && !remarks.trim()) {
      showToast(`Please enter a mandatory remark/reason for "${decision}".`, 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyCrop(crop.id, decision, remarks.trim() || 'Verified on-site by Field Officer.', {
        cropCondition,
        fieldCondition: `Inspected at GPS coords (${crop.latitude}, ${crop.longitude}). Healthy crop stand.`,
        pestInfestationRisk: 'Low',
        soilMoistureCondition: 'Adequate',
        estimatedYieldPerAcreKg: 30000,
      });

      showToast(`Crop ${crop.id} successfully marked as "${decision}".`, 'success');
      onClose();
    } catch (err) {
      showToast('Error saving verification record.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Field Crop Verification: ${crop.id}`}
      subtitle="Examine geotagged photographic evidence and GPS coordinates"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
          {/* Farmer Info */}
          <div className="p-4.5 bg-[#F3EFE4] rounded-2xl border border-[#DFD7C4] space-y-2">
            <h4 className="text-xs font-bold text-[#173522] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#D97824]" />
              Farmer Information
            </h4>
            <div className="text-xs space-y-1 text-[#777268]">
              <p>
                <strong className="text-[#173522]">Name:</strong> {crop.farmerName}
              </p>
              <p className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#777268]" />
                <span className="font-mono text-[#173522]">{crop.farmerPhone}</span>
              </p>
              <p>
                <strong className="text-[#173522]">Village:</strong> {crop.village}
              </p>
              <p>
                <strong className="text-[#173522]">District:</strong> {crop.district}, {crop.state}
              </p>
            </div>
          </div>

          {/* Crop Info */}
          <div className="p-4.5 bg-[#F3EFE4] rounded-2xl border border-[#DFD7C4] space-y-2">
            <h4 className="text-xs font-bold text-[#173522] uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#173522]" />
              Crop Information
            </h4>
            <div className="text-xs space-y-1 text-[#777268]">
              <p>
                <strong className="text-[#173522]">Crop:</strong> {crop.cropType} ({crop.variety})
              </p>
              <p>
                <strong className="text-[#173522]">Area:</strong> {crop.landArea} {crop.landUnit}
              </p>
              <p className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#777268]" />
                <span>Sown: {crop.sowingDate} | Exp. Harvest: {crop.expectedHarvestDate}</span>
              </p>
              <div className="pt-1">
                <StatusBadge status={crop.status} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Section: Image & Map */}
        <div className="space-y-3 font-sans">
          <h4 className="text-xs font-bold text-[#173522] uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#D97824]" />
            Field Evidence (Geotagged Photo &amp; GPS Plot)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden border border-[#DFD7C4] bg-[#F3EFE4] h-52 relative group">
              <img
                src={crop.imageUrl}
                alt="Field evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-[#12281A]/85 text-[#F3EFE4] px-2.5 py-1 rounded-lg text-[10px] font-mono backdrop-blur-xs">
                Captured: {new Date(crop.capturedAt).toLocaleString()}
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="rounded-2xl overflow-hidden border border-[#DFD7C4]">
                <MapView
                  center={[crop.latitude, crop.longitude]}
                  zoom={14}
                  height="208px"
                  markers={[
                    {
                      lat: crop.latitude,
                      lng: crop.longitude,
                      title: `${crop.cropType} Field`,
                      subtitle: `${crop.farmerName} (${crop.village})`,
                      type: 'crop',
                    },
                  ]}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#777268] font-mono px-1">
                <span className="flex items-center gap-1 text-[#173522]">
                  <MapPin className="w-3 h-3 text-[#D97824]" />
                  {crop.latitude.toFixed(5)}° N, {crop.longitude.toFixed(5)}° E
                </span>
                {crop.locationAccuracy && <span>&plusmn;{crop.locationAccuracy}m precision</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Action Decision */}
        <div className="space-y-3 pt-4 border-t border-[#DFD7C4] font-sans">
          <label className="text-xs font-bold text-[#173522] block">Select Verification Decision</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setDecision('Verified')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer ${
                decision === 'Verified'
                  ? 'bg-[#F3EFE4] border-[#173522] text-[#173522] ring-2 ring-[#173522]/20 shadow-xs'
                  : 'bg-white border-[#DFD7C4] text-[#777268] hover:bg-[#F3EFE4]'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-[#173522]" />
              <span>Verify Crop</span>
            </button>

            <button
              type="button"
              onClick={() => setDecision('Re-verification Required')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer ${
                decision === 'Re-verification Required'
                  ? 'bg-[#F3EFE4] border-[#D97824] text-[#D97824] ring-2 ring-[#D97824]/20 shadow-xs'
                  : 'bg-white border-[#DFD7C4] text-[#777268] hover:bg-[#F3EFE4]'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-[#D97824]" />
              <span>Request Re-verify</span>
            </button>

            <button
              type="button"
              onClick={() => setDecision('Rejected')}
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition cursor-pointer ${
                decision === 'Rejected'
                  ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20 shadow-xs'
                  : 'bg-white border-[#DFD7C4] text-[#777268] hover:bg-[#F3EFE4]'
              }`}
            >
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Reject Crop</span>
            </button>
          </div>

          {/* Condition selector if verified */}
          {decision === 'Verified' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#173522] block mb-1">
                  Observed Crop Stand Condition
                </label>
                <select
                  value={cropCondition}
                  onChange={(e) => setCropCondition(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 text-[#171713] focus:bg-white focus:ring-2 focus:ring-[#173522]"
                >
                  <option value="Excellent">Excellent - Vigorous growth</option>
                  <option value="Good">Good - Standard canopy</option>
                  <option value="Average">Average - Fair growth</option>
                  <option value="Poor">Poor - Deficiencies noted</option>
                </select>
              </div>
            </div>
          )}

          {/* Remarks text input */}
          <div className="pt-2">
            <label className="text-xs font-semibold text-[#173522] block mb-1">
              {decision === 'Verified'
                ? 'Field Inspection Remarks / Observations'
                : `Reason for ${decision} (Mandatory)`}
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                decision === 'Verified'
                  ? 'e.g., GPS coordinates verified on-site. Cane internode height and leaf vigor are healthy.'
                  : 'e.g., Image unclear / coordinates outside designated village survey boundaries.'
              }
              className="w-full text-xs p-3 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 text-[#171713] focus:bg-white focus:ring-2 focus:ring-[#173522] focus:outline-none"
              required={decision !== 'Verified'}
            />
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DFD7C4] font-sans">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#777268] hover:bg-[#F3EFE4] rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition cursor-pointer ${
              decision === 'Verified'
                ? 'bg-[#173522] hover:bg-[#244532]'
                : decision === 'Re-verification Required'
                ? 'bg-[#D97824] hover:bg-[#c2671b]'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {isSubmitting ? 'Saving...' : `Confirm ${decision}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
