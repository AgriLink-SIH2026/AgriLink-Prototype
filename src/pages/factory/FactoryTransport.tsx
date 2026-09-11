import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { TransportModal } from '../../components/factory/TransportModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProcurementRecord } from '../../types';
import { Truck, Search, Phone, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const FactoryTransport: React.FC = () => {
  const { procurements } = useAppData();
  const [selectedProcurement, setSelectedProcurement] = useState<ProcurementRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const transportLots = procurements.filter((p) => p.currentStatus !== 'Crop Registered');

  const filtered = transportLots.filter((p) => {
    const q = searchQuery.toLowerCase();
    const vehicle = p.transport?.vehicleNumber.toLowerCase() || '';
    const driver = p.transport?.driverName.toLowerCase() || '';
    const farmer = p.farmerName.toLowerCase();
    const crop = p.cropType.toLowerCase();
    return vehicle.includes(q) || driver.includes(q) || farmer.includes(q) || crop.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Truck className="w-3.5 h-3.5 text-amber-700" />
            <span>Section 19 • Farm Logistics &amp; Transport</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Transport &amp; Vehicle Dispatch
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign transport vehicles, drivers, and coordinate real-time consignment transit from farm gate to procurement yard.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by vehicle #, driver name, or farmer..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((proc) => {
          const t = proc.transport;
          return (
            <div
              key={proc.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Lot #{proc.id} • {proc.cropType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {proc.farmerName}
                    </h3>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      t
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {t?.status || 'Not Assigned'}
                  </span>
                </div>

                {t ? (
                  <div className="pt-2 text-xs text-slate-600 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {t.vehicleNumber}
                      </span>
                      <span className="text-slate-400">{t.pickupDate}</span>
                    </div>

                    <p className="flex items-center gap-1.5 font-medium">
                      <span>Driver: {t.driverName}</span>
                      <span className="font-mono text-slate-500">({t.driverPhone})</span>
                    </p>

                    <p className="flex items-start gap-1 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{t.pickupLocation} &rarr; {t.destination}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-3 italic">
                    Transport not yet dispatched. Click below to assign vehicle and driver.
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedProcurement(proc)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t ? 'Update Transport Status' : 'Assign Vehicle & Driver'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProcurement && (
        <TransportModal
          isOpen={!!selectedProcurement}
          onClose={() => setSelectedProcurement(null)}
          procurement={selectedProcurement}
        />
      )}
    </div>
  );
};
