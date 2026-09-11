import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Users,
  Sprout,
  Milestone,
  CheckCheck,
  Scale,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const FactoryAnalytics: React.FC = () => {
  const { crops, procurements } = useAppData();

  // 1. Core KPIs calculated directly from live database state
  const totalFarmers = new Set(crops.map((c) => c.farmerId)).size;
  const verifiedCropsCount = crops.filter((c) => c.status === 'Verified').length;
  const totalProcurementsCount = procurements.length;
  const completedProcurementsCount = procurements.filter(
    (p) => p.currentStatus === 'Completed'
  ).length;
  const pendingProcurementCount = Math.max(0, verifiedCropsCount - totalProcurementsCount);

  const totalQuantityProcuredKg = procurements.reduce(
    (sum, p) => sum + (p.weighment?.netWeightKg || 0),
    0
  );

  const totalPaymentAmount = procurements.reduce(
    (sum, p) => sum + (p.bill?.totalAmount || 0),
    0
  );

  // 2. Crop-wise procurement quantity breakdown (Real calculation)
  const cropWiseMap: Record<string, number> = {};
  procurements.forEach((p) => {
    const qty = p.weighment?.netWeightKg || 0;
    cropWiseMap[p.cropType] = (cropWiseMap[p.cropType] || 0) + qty;
  });

  // Ensure all registered crops have entries
  crops.forEach((c) => {
    if (!cropWiseMap[c.cropType]) {
      cropWiseMap[c.cropType] = 0;
    }
  });

  const cropVolumeData = Object.entries(cropWiseMap).map(([crop, kg]) => ({
    crop,
    tonnes: Number((kg / 1000).toFixed(2)),
  }));

  // 3. Procurement Status Breakdown (Real calculation)
  const statusCounts: Record<string, number> = {};
  procurements.forEach((p) => {
    statusCounts[p.currentStatus] = (statusCounts[p.currentStatus] || 0) + 1;
  });

  const statusPieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-amber-700" />
          <span>Section 27 • Industrial Intelligence &amp; Throughput</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Factory Procurement Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics computed directly from registered farmer crops, electronic weighbridge certified slips, and payment records.
        </p>
      </div>

      {/* Primary KPI Metric Cards (Requirement 27) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Registered Farmers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalFarmers}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Active agricultural suppliers</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Verified Crop Plots</span>
            <Sprout className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-600">{verifiedCropsCount}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Officer approved</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Quantity Procured</span>
            <Scale className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-indigo-600">
            {(totalQuantityProcuredKg / 1000).toFixed(1)} MT
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {totalQuantityProcuredKg.toLocaleString()} kg certified
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Total Payment Amount</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-mono text-2xl font-extrabold text-emerald-700">
            ₹{totalPaymentAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Billed &amp; direct payout</span>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500">Procurement Batches</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{totalProcurementsCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500">Completed Batches</span>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{completedProcurementsCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500">Pending Scheduling</span>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{pendingProcurementCount}</p>
        </div>
      </div>

      {/* Recharts Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Crop-wise Procurement Volume */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Crop-Wise Procured Volume (Metric Tonnes)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live aggregation of certified electronic weighbridge receipts
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#64748b' }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} MT`, 'Procured Quantity']}
                  contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="tonnes" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Procurement Pipeline Stage Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Procurement Lifecycle Stage Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current active lots across intake and processing gates
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {statusPieData.length === 0 ? (
              <p className="text-xs text-slate-400">No active batches</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
