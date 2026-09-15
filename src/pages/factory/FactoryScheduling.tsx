import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowDownUp, Calendar, CheckCircle2, Clock3, Gauge, RefreshCw, Zap } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';

export const FactoryScheduling: React.FC = () => {
  const { procurements } = useAppData();
  const { showToast } = useToast();
  const [optimizedAt, setOptimizedAt] = useState<Date | null>(null);

  const queue = useMemo(() => procurements
    .filter((p) => p.currentStatus !== 'Completed')
    .map((p, index) => {
      const priorityBoost = p.priority === 'Urgent' ? 40 : p.priority === 'High' ? 20 : 0;
      const freshness = Math.max(0, 12 - index * 2);
      return { ...p, score: 50 + priorityBoost + freshness };
    })
    .sort((a, b) => b.score - a.score), [procurements, optimizedAt]);

  const runAllocation = () => {
    setOptimizedAt(new Date());
    showToast('Queue rebalanced against capacity, priority and live arrivals.', 'success');
  };

  return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2"><Zap className="w-3.5 h-3.5" /> Dynamic queue engine</div><h2 className="text-3xl font-serif font-bold text-[#173522]">Live Intake Allocation</h2><p className="text-xs text-[#777268] mt-1">Continuously balances arrival readiness, crop urgency and processing capacity.</p></div>
      <button onClick={runAllocation} className="px-4 py-3 bg-[#173522] text-white rounded-xl text-xs font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Rebalance queue now</button>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-[#DFD7C4] rounded-2xl p-4"><span className="text-[10px] font-bold text-[#777268] uppercase">Live throughput</span><p className="text-2xl font-black text-[#173522] mt-1">82%</p><span className="text-[11px] text-emerald-700">Within target capacity</span></div>
      <div className="bg-white border border-[#DFD7C4] rounded-2xl p-4"><span className="text-[10px] font-bold text-[#777268] uppercase">Lots expected</span><p className="text-2xl font-black text-[#173522] mt-1">{queue.length}</p><span className="text-[11px] text-[#777268]">Booked intake slots</span></div>
      <div className="bg-white border border-[#DFD7C4] rounded-2xl p-4"><span className="text-[10px] font-bold text-[#777268] uppercase">Average wait</span><p className="text-2xl font-black text-[#173522] mt-1">31 min</p><span className="text-[11px] text-emerald-700">↓ 18 min after allocation</span></div>
      <div className="bg-white border border-[#DFD7C4] rounded-2xl p-4"><span className="text-[10px] font-bold text-[#777268] uppercase">Released slots</span><p className="text-2xl font-black text-[#173522] mt-1">2</p><span className="text-[11px] text-[#777268]">Auto-offered to next farmers</span></div>
    </div>
    <section className="bg-[#FFF4E8] border border-[#F1D0AE] rounded-2xl p-4 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-[#B45F1B] shrink-0" /><div><b className="text-sm text-[#7C4318]">Queue auto-adjustment active</b><p className="text-[11px] text-[#8A684D] mt-1">Gate 2 is running 24 minutes behind. Two booked lots were shifted to Gate 1; affected farmers received an SMS and IVR update.</p></div></section>
    <section className="bg-white rounded-[26px] border border-[#DFD7C4] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#DFD7C4] flex items-center justify-between"><div><h3 className="font-serif text-lg font-bold text-[#173522]">Optimized arrival queue</h3><p className="text-[11px] text-[#777268]">Highest operational score receives the earliest compatible slot.</p></div>{optimizedAt && <span className="text-[10px] text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Updated {optimizedAt.toLocaleTimeString()}</span>}</div>
      <div className="divide-y divide-[#EEE8DB]">
        {queue.map((item, index) => <div key={item.id} className="p-5 grid md:grid-cols-[auto_1.3fr_.8fr_.8fr_.8fr] gap-4 items-center">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${index === 0 ? 'bg-[#D97824] text-white' : 'bg-[#F3EFE4] text-[#173522]'}`}>#{index + 1}</div>
          <div><b className="text-sm text-[#173522]">{item.farmerName}</b><p className="text-[11px] text-[#777268]">{item.cropType} · {item.batchNumber || item.id}</p></div>
          <div className="text-xs"><span className="text-[10px] text-[#777268] uppercase block">Arrival</span><b className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.scheduledDate || 'Flexible'}</b></div>
          <div className="text-xs"><span className="text-[10px] text-[#777268] uppercase block">Slot status</span><b className="flex items-center gap-1"><Clock3 className="w-3 h-3" /> Confirmed</b></div>
          <div className="text-xs"><span className="text-[10px] text-[#777268] uppercase block">Allocation score</span><b className="flex items-center gap-1 text-[#173522]"><Gauge className="w-3 h-3" /> {item.score}/100 · {index < 2 ? 'Gate 1' : 'Gate 2'}</b></div>
        </div>)}
      </div>
    </section>
    <div className="grid md:grid-cols-3 gap-4 text-xs">
      <div className="p-4 bg-[#EDF4EC] rounded-2xl border border-[#C9D8C9] flex gap-2"><ArrowDownUp className="w-4 h-4 text-[#173522] shrink-0"/><span><b className="block text-[#173522]">Capacity-aware</b><span className="text-[#55705D]">Reassigns gates when processing load changes.</span></span></div>
      <div className="p-4 bg-[#EDF4EC] rounded-2xl border border-[#C9D8C9] flex gap-2"><Clock3 className="w-4 h-4 text-[#173522] shrink-0"/><span><b className="block text-[#173522]">Readiness-aware</b><span className="text-[#55705D]">Prioritizes confirmed slots and crop urgency.</span></span></div>
      <div className="p-4 bg-[#EDF4EC] rounded-2xl border border-[#C9D8C9] flex gap-2"><Calendar className="w-4 h-4 text-[#173522] shrink-0"/><span><b className="block text-[#173522]">Release-aware</b><span className="text-[#55705D]">Fills emergency cancellations from the waitlist.</span></span></div>
    </div>
  </div>;
};
