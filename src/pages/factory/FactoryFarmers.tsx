import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { getStoredUsers, getStoredFarmerProfiles } from '../../services/storage';
import { Users, Phone, MapPin, Scale, Search } from 'lucide-react';

export const FactoryFarmers: React.FC = () => {
  const { procurements, crops } = useAppData();
  const allUsers = getStoredUsers().filter((u) => u.role === 'farmer');
  const allProfiles = getStoredFarmerProfiles();

  const [searchQuery, setSearchQuery] = useState('');

  const supplierStats = allUsers.map((user) => {
    const profile = allProfiles[user.id];
    const farmerProcurements = procurements.filter((p) => p.farmerId === user.id);
    const farmerCrops = crops.filter((c) => c.farmerId === user.id);

    const totalSuppliedKg = farmerProcurements.reduce(
      (sum, p) => sum + (p.weighment?.netWeightKg || 0),
      0
    );
    const totalPayout = farmerProcurements.reduce(
      (sum, p) => sum + (p.bill?.totalAmount || 0),
      0
    );

    return {
      user,
      profile,
      plotsCount: farmerCrops.length,
      procurementCount: farmerProcurements.length,
      totalSuppliedKg,
      totalPayout,
    };
  });

  const filtered = supplierStats.filter((item) => {
    const q = searchQuery.toLowerCase();
    const name = item.user.name.toLowerCase();
    const village = item.profile?.village.toLowerCase() || '';
    const district = item.profile?.district.toLowerCase() || '';
    return name.includes(q) || village.includes(q) || district.includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5 text-amber-700" />
          <span>Section 14 • Catchment Agricultural Suppliers</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Supplying Farmers Directory
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Registered rural smallholders supplying sugarcane, cotton, oilseeds, and plantation crops to your processing mill.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search supplier by name, village, or district..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.user.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-extrabold text-base">
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

              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {item.user.id}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100">
              <div className="p-2.5 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Plots Registered
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {item.plotsCount}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Procured Lots
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {item.procurementCount}
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl text-center">
                <span className="text-[10px] text-emerald-800 uppercase font-semibold block">
                  Volume Delivered
                </span>
                <span className="text-sm font-mono font-bold text-emerald-900 mt-0.5 block">
                  {(item.totalSuppliedKg / 1000).toFixed(1)} MT
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {item.user.phone}
              </span>
              <span className="font-mono font-bold text-slate-900">
                Payout: ₹{item.totalPayout.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
