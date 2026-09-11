import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, User, Sprout, AlertCircle, ArrowRight } from 'lucide-react';

export const FactoryScheduling: React.FC = () => {
  const { procurements, crops } = useAppData();
  const { showToast } = useToast();

  const [dateFilter, setDateFilter] = useState('');

  const scheduledLots = procurements.filter(
    (p) => p.currentStatus === 'Procurement Scheduled' || p.currentStatus === 'Harvest Scheduled'
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
          <Calendar className="w-3.5 h-3.5 text-amber-700" />
          <span>Section 18 • Intake Slot Scheduling &amp; Capacity Balancer</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Procurement Scheduling Calendar
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Synchronize harvest gang availability with factory daily crushing and processing capacity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scheduledLots.map((proc) => (
          <div
            key={proc.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  Batch: {proc.batchNumber || proc.id}
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {proc.priority}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mt-2">
                {proc.cropType} ({proc.variety})
              </h4>
              <p className="text-xs text-slate-600">
                Farmer: <strong className="text-slate-800">{proc.farmerName}</strong> (
                {proc.farmerPhone})
              </p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mt-3 text-xs space-y-1">
                <p className="flex items-center justify-between">
                  <span className="text-slate-500">Harvest Date:</span>
                  <span className="font-bold text-slate-800">{proc.harvestDate}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-500">Factory Intake:</span>
                  <span className="font-bold text-amber-700">{proc.scheduledDate}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <a
                href="/factory/procurement"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
              >
                Manage Slot &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
