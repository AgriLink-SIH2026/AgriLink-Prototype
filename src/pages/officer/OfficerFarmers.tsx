import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { getStoredUsers, getStoredFarmerProfiles } from '../../services/storage';
import { Users, Phone, MapPin, Sprout, Search } from 'lucide-react';

export const OfficerFarmers: React.FC = () => {
  const { crops } = useAppData();
  const allUsers = getStoredUsers().filter((u) => u.role === 'farmer');
  const allProfiles = getStoredFarmerProfiles();

  const [searchQuery, setSearchQuery] = useState('');

  const farmersWithStats = allUsers.map((user) => {
    const profile = allProfiles[user.id];
    const farmerCrops = crops.filter((c) => c.farmerId === user.id);
    const verifiedCount = farmerCrops.filter((c) => c.status === 'Verified').length;
    const pendingCount = farmerCrops.filter((c) => c.status === 'Pending Verification').length;

    return {
      user,
      profile,
      crops: farmerCrops,
      verifiedCount,
      pendingCount,
    };
  });

  const filtered = farmersWithStats.filter((f) => {
    const name = f.user.name.toLowerCase();
    const village = f.profile?.village.toLowerCase() || '';
    const district = f.profile?.district.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return name.includes(q) || village.includes(q) || district.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5 text-blue-700" />
          <span>Section 10 • Farmer Community Registry</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Regional Farmers Directory
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Registered farmers within your field extension zone.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmer by name, village, or district..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Farmers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.user.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-base">
                  {item.user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.user.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {item.profile?.village || 'Village'}, {item.profile?.district || 'District'}
                    </span>
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {item.user.id}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100">
              <div className="p-2.5 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Plots
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {item.crops.length}
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-center">
                <span className="text-[10px] text-emerald-700 uppercase font-semibold block">
                  Verified
                </span>
                <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                  {item.verifiedCount}
                </span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl text-center">
                <span className="text-[10px] text-amber-700 uppercase font-semibold block">
                  Pending
                </span>
                <span className="text-sm font-bold text-amber-800 mt-0.5 block">
                  {item.pendingCount}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {item.user.phone}
              </span>
              <a
                href="/officer/verification"
                className="text-blue-600 hover:text-blue-700 font-bold"
              >
                Inspect Plots &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
