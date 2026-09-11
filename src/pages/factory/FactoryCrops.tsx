import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CROP_LIST } from '../../config/crops';
import { Sprout, Search, Filter, Calendar, MapPin, PlusCircle, CheckCircle2 } from 'lucide-react';

export const FactoryCrops: React.FC = () => {
  const { crops, procurements } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('all');

  // Set of crops already in procurement
  const existingProcurementCropIds = new Set(procurements.map((p) => p.cropRegistrationId));

  const verifiedCrops = crops.filter((c) => c.status === 'Verified');

  const filtered = verifiedCrops.filter((crop) => {
    const matchesSearch =
      crop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = cropFilter === 'all' || crop.cropType === cropFilter;
    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Sprout className="w-3.5 h-3.5 text-amber-700" />
            <span>Section 18 • Verified Crop Intake Pool</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Verified Catchment Crops
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Crops inspected and approved by Field Officers, eligible to enter your factory procurement schedule.
          </p>
        </div>

        <a
          href="/factory/procurement"
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Open Procurement Queue</span>
        </a>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified crop ID, farmer, or village..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
        >
          <option value="all">All Crops</option>
          {CROP_LIST.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((crop) => {
          const inProcurement = existingProcurementCropIds.has(crop.id);
          return (
            <div
              key={crop.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {crop.id}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">
                      {crop.cropType} ({crop.variety})
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inProcurement
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {inProcurement ? 'In Procurement' : 'Ready for Intake'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p>
                    <strong>Farmer:</strong> {crop.farmerName} ({crop.farmerPhone})
                  </p>
                  <p>
                    <strong>Area:</strong> {crop.landArea} {crop.landUnit}
                  </p>
                  <p>
                    <strong>Location:</strong> {crop.village}, {crop.district}
                  </p>
                  <p>
                    <strong>Harvest Window:</strong> {crop.expectedHarvestDate}
                  </p>
                  {crop.officerRemarks && (
                    <p className="text-[11px] text-slate-500 italic pt-1">
                      &ldquo;{crop.officerRemarks}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <a
                  href="/factory/procurement"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
                >
                  {inProcurement ? 'View in Queue &rarr;' : 'Add to Intake Queue &rarr;'}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
