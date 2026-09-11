import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationModal } from '../../components/officer/VerificationModal';
import { CropRegistration } from '../../types';
import { navigate } from '../../utils/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Search,
  Eye,
  Calendar,
  MapPin,
  Camera,
  ChevronRight,
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { crops, inspections } = useAppData();

  const [selectedCropToVerify, setSelectedCropToVerify] = useState<CropRegistration | null>(null);

  // Metrics
  const pendingCrops = crops.filter((c) => c.status === 'Pending Verification');
  const verifiedCrops = crops.filter((c) => c.status === 'Verified');
  const reverifyCrops = crops.filter((c) => c.status === 'Re-verification Required');
  const uniqueFarmersCount = new Set(crops.map((c) => c.farmerId)).size;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12281A] rounded-3xl text-[#F3EFE4] p-6 sm:p-8 border border-[#244532] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173522] border border-[#244532] text-[#D97824] text-xs font-semibold mb-2 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97824]" />
            <span>Field Verification &amp; Agronomic Inspection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F3EFE4] tracking-tight">
            Officer Dashboard: {currentUser?.name || 'Rajesh Sharma'}
          </h2>
          <p className="text-[#EBE5D6]/80 text-xs sm:text-sm mt-1 font-sans">
            Review geotagged crop registrations, corroborate GIS boundaries, and issue official harvest eligibility certifications.
          </p>
        </div>

        <button
          onClick={() => navigate('/officer/verification')}
          className="px-5 py-3 bg-[#D97824] hover:bg-[#c2671b] text-white rounded-2xl font-bold text-xs shadow-sm transition flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer font-sans"
        >
          <span>Open Verification Queue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-2">
            <span className="text-xs font-semibold text-[#173522]">Pending Queue</span>
            <Clock className="w-4 h-4 text-[#D97824]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#D97824]">{pendingCrops.length}</p>
          <span className="text-[10px] text-[#777268] mt-1 block">Awaiting field review</span>
        </div>

        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-2">
            <span className="text-xs font-semibold text-[#173522]">Verified Plots</span>
            <CheckCircle2 className="w-4 h-4 text-[#173522]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#173522]">{verifiedCrops.length}</p>
          <span className="text-[10px] text-[#777268] mt-1 block">Approved for intake</span>
        </div>

        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-2">
            <span className="text-xs font-semibold text-[#173522]">Re-verify Requests</span>
            <AlertTriangle className="w-4 h-4 text-[#D97824]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#D97824]">{reverifyCrops.length}</p>
          <span className="text-[10px] text-[#777268] mt-1 block">Corrections required</span>
        </div>

        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-2">
            <span className="text-xs font-semibold text-[#173522]">Farmers in Zone</span>
            <Users className="w-4 h-4 text-[#173522]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#173522]">{uniqueFarmersCount}</p>
          <span className="text-[10px] text-[#777268] mt-1 block">Assigned producers</span>
        </div>
      </div>

      {/* Pending Verifications Queue Table (Requirement 11) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD7C4] shadow-xs space-y-4 font-sans">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#173522]">
              Pending Crop Registrations Awaiting Inspection
            </h3>
            <p className="text-xs text-[#777268] mt-0.5">
              Click &ldquo;Inspect Plot&rdquo; on any record to inspect GPS coordinates, map placement, and photo proof.
            </p>
          </div>
          <span className="text-xs font-bold text-[#D97824] bg-[#F3EFE4] border border-[#D97824]/30 px-3 py-1 rounded-full">
            {pendingCrops.length} Pending
          </span>
        </div>

        {pendingCrops.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[#DFD7C4] bg-[#F3EFE4]/40 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-[#173522] mx-auto mb-2" />
            <p className="text-sm font-serif font-bold text-[#173522]">Verification Queue is Cleared!</p>
            <p className="text-xs text-[#777268] mt-0.5">
              All submitted crop plots have been inspected and verified.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F3EFE4] text-[#173522] font-semibold border-b border-[#DFD7C4]">
                <tr>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Crop &amp; Variety</th>
                  <th className="p-3">Registration ID</th>
                  <th className="p-3">Sowing Date</th>
                  <th className="p-3">Village / District</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFD7C4]/60">
                {pendingCrops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-[#F3EFE4]/60 transition">
                    <td className="p-3">
                      <p className="font-bold text-[#173522]">{crop.farmerName}</p>
                      <span className="font-mono text-[10px] text-[#777268]">{crop.farmerPhone}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-[#171713]">{crop.cropType}</span>
                      <span className="block text-[10px] text-[#777268]">{crop.variety} ({crop.landArea} {crop.landUnit})</span>
                    </td>
                    <td className="p-3 font-mono font-medium text-[#171713]">{crop.id}</td>
                    <td className="p-3 text-[#777268]">{crop.sowingDate}</td>
                    <td className="p-3">
                      <span className="text-[#171713]">{crop.village}</span>
                      <span className="block text-[10px] text-[#777268]">{crop.district}</span>
                    </td>
                    <td className="p-3 text-[#777268]">
                      {new Date(crop.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={crop.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedCropToVerify(crop)}
                        className="px-3.5 py-2 bg-[#173522] hover:bg-[#244532] text-[#F3EFE4] rounded-xl font-semibold text-xs transition inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D97824]" />
                        <span>Inspect Plot</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Inspection Activity Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD7C4] shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-[#173522]">Recent Verification Activity</h3>
          <button
            onClick={() => navigate('/officer/inspection-reports')}
            className="text-xs font-semibold text-[#D97824] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>All Reports ({inspections.length})</span>
            <span>&rarr;</span>
          </button>
        </div>

        {verifiedCrops.length === 0 ? (
          <p className="text-xs text-[#777268] py-4 text-center">No verified crops logged yet.</p>
        ) : (
          <div className="divide-y divide-[#DFD7C4]/60">
            {verifiedCrops.slice(0, 4).map((crop) => (
              <div key={crop.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F3EFE4] border border-[#DFD7C4] text-[#173522] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-[#173522]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#173522]">
                      {crop.farmerName} • {crop.cropType} ({crop.id})
                    </p>
                    <p className="text-[11px] text-[#777268]">
                      Verified on {crop.verificationDate ? new Date(crop.verificationDate).toLocaleDateString() : 'Recent'} • {crop.village}
                    </p>
                  </div>
                </div>

                <StatusBadge status={crop.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Modal Dialog */}
      {selectedCropToVerify && (
        <VerificationModal
          isOpen={!!selectedCropToVerify}
          onClose={() => setSelectedCropToVerify(null)}
          crop={selectedCropToVerify}
        />
      )}
    </div>
  );
};
