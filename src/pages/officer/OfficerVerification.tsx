import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationModal } from '../../components/officer/VerificationModal';
import { CropRegistration, CropStatus } from '../../types';
import { CROP_LIST } from '../../config/crops';
import {
  CheckSquare,
  Search,
  Filter,
  Eye,
  MapPin,
  Calendar,
  Camera,
  ShieldCheck,
} from 'lucide-react';

export const OfficerVerification: React.FC = () => {
  const { crops } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('Pending Verification');
  const [selectedCrop, setSelectedCrop] = useState<CropRegistration | null>(null);

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = cropFilter === 'all' || crop.cropType === cropFilter;
    const matchesStatus = statusFilter === 'all' || crop.status === statusFilter;

    return matchesSearch && matchesCrop && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EFE4] border border-[#DFD7C4] text-[#173522] text-xs font-semibold mb-2 font-sans">
          <CheckSquare className="w-3.5 h-3.5 text-[#D97824]" />
          <span>Field Verification &amp; Inspection Queue</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#173522] tracking-tight">
          Crop Verification Portal
        </h2>
        <p className="text-xs font-sans text-[#777268] mt-1">
          Validate farmer geotags, examine photographic evidence, and approve crops for factory procurement eligibility.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#DFD7C4] shadow-xs flex flex-col sm:flex-row gap-3 font-sans">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#777268] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, farmer name, or village..."
            className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173522] text-[#171713]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173522] text-[#171713]"
          >
            <option value="all">All Verification Statuses</option>
            <option value="Pending Verification">Pending Verification (Active)</option>
            <option value="Verified">Verified ✓</option>
            <option value="Rejected">Rejected</option>
            <option value="Re-verification Required">Re-verification Required</option>
          </select>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173522] text-[#171713]"
          >
            <option value="all">All Crops</option>
            {CROP_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Queue Cards Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DFD7C4] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F3EFE4] border border-[#DFD7C4] flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="w-7 h-7 text-[#D97824]" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#173522]">No crops matching filter criteria</h3>
          <p className="text-xs font-sans text-[#777268] mt-1">Try changing status filter or clearing search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-[#DFD7C4] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 bg-[#F3EFE4] overflow-hidden">
                  <img
                    src={crop.imageUrl}
                    alt={crop.cropType}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#173522]/85 text-[#F3EFE4] font-mono text-[10px] px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/10">
                    {crop.id}
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={crop.status} size="sm" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-[#12281A]/85 backdrop-blur-xs text-[#F3EFE4] px-2.5 py-1.5 rounded-xl text-[11px] flex items-center justify-between font-mono border border-white/10">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D97824]" />
                      <span className="font-sans">{crop.village}</span>
                    </span>
                    <span className="text-[10px] text-[#D97824]">
                      {crop.latitude.toFixed(3)}°, {crop.longitude.toFixed(3)}°
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-[#173522]">
                      {crop.cropType} ({crop.variety})
                    </h4>
                    <p className="text-xs text-[#777268] mt-0.5">
                      Farmer: <strong className="text-[#173522]">{crop.farmerName}</strong> (
                      {crop.farmerPhone})
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#777268] pt-2 border-t border-[#DFD7C4]">
                    <div>
                      <span className="text-[10px] text-[#777268] block uppercase tracking-wider">Area</span>
                      <span className="font-semibold text-[#173522]">
                        {crop.landArea} {crop.landUnit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#777268] block uppercase tracking-wider">Sown On</span>
                      <span className="font-semibold text-[#171713]">{crop.sowingDate}</span>
                    </div>
                  </div>

                  {crop.officerRemarks && (
                    <div className="p-3 bg-[#F3EFE4] border border-[#DFD7C4] rounded-2xl text-xs text-[#777268]">
                      <span className="font-semibold text-[#173522] block text-[10px] uppercase tracking-wider">
                        Current Remarks:
                      </span>
                      <p className="line-clamp-2 italic font-serif mt-0.5 text-[#171713]">&ldquo;{crop.officerRemarks}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedCrop(crop)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                    crop.status === 'Pending Verification'
                      ? 'bg-[#173522] hover:bg-[#244532] text-[#F3EFE4]'
                      : 'bg-[#F3EFE4] hover:bg-[#EBE5D6] text-[#173522] border border-[#DFD7C4]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#D97824]" />
                  <span>
                    {crop.status === 'Pending Verification'
                      ? 'Inspect & Verify Crop'
                      : 'Re-evaluate Verification'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Modal */}
      {selectedCrop && (
        <VerificationModal
          isOpen={!!selectedCrop}
          onClose={() => setSelectedCrop(null)}
          crop={selectedCrop}
        />
      )}
    </div>
  );
};
