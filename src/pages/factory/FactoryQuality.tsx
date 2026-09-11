import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { QualityWeighmentModal } from '../../components/factory/QualityWeighmentModal';
import { ProcurementRecord } from '../../types';
import { Scale, FlaskConical, CheckCircle2, Search } from 'lucide-react';

export const FactoryQuality: React.FC = () => {
  const { procurements } = useAppData();
  const [selectedProcurement, setSelectedProcurement] = useState<ProcurementRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = procurements.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.farmerName.toLowerCase().includes(q) ||
      p.cropType.toLowerCase().includes(q) ||
      (p.batchNumber && p.batchNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          <span>Section 20 • Certified Electronic Weighbridge &amp; Lab QC</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Quality Grading &amp; Weighment
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Perform laboratory quality parameter tests and record certified gross/tare weights with automatic net weight calculation.
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lot by farmer, crop, or batch #..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((proc) => {
          const hasWeighed = !!proc.weighment;
          const hasQuality = !!proc.quality;

          return (
            <div
              key={proc.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Lot #{proc.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {proc.cropType} ({proc.variety})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Farmer: <strong className="text-slate-700">{proc.farmerName}</strong>
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      hasWeighed
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {hasWeighed ? 'Certified ✓' : 'Pending Weighment'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Quality Grade
                    </span>
                    {hasQuality ? (
                      <div>
                        <p className="font-bold text-slate-800">{proc.quality?.grade}</p>
                        {proc.quality?.brixPercentage && (
                          <span className="text-[11px] text-slate-500 block">
                            Brix: {proc.quality.brixPercentage}%
                          </span>
                        )}
                        {proc.quality?.stapleLengthMm && (
                          <span className="text-[11px] text-slate-500 block">
                            Staple: {proc.quality.stapleLengthMm}mm
                          </span>
                        )}
                        {proc.quality?.oilContentPercentage && (
                          <span className="text-[11px] text-slate-500 block">
                            Oil: {proc.quality.oilContentPercentage}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Not tested</span>
                    )}
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                      Certified Net Weight
                    </span>
                    {hasWeighed ? (
                      <div>
                        <p className="font-mono text-base font-extrabold text-emerald-900">
                          {proc.weighment?.netWeightKg.toLocaleString()} kg
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          Gross: {proc.weighment?.grossWeightKg.toLocaleString()} kg | Tare:{' '}
                          {proc.weighment?.tareWeightKg.toLocaleString()} kg
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Pending scale slip</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedProcurement(proc)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{hasWeighed ? 'Review / Edit Weighment' : 'Record Quality & Weighment'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProcurement && (
        <QualityWeighmentModal
          isOpen={!!selectedProcurement}
          onClose={() => setSelectedProcurement(null)}
          procurement={selectedProcurement}
        />
      )}
    </div>
  );
};
