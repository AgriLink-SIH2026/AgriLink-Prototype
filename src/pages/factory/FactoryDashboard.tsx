import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SmartInsights } from '../../components/common/SmartInsights';
import { SmartInsightsService } from '../../services/smartInsights';
import { TransportModal } from '../../components/factory/TransportModal';
import { QualityWeighmentModal } from '../../components/factory/QualityWeighmentModal';
import { BillGenerateModal } from '../../components/factory/BillGenerateModal';
import { ProcurementRecord } from '../../types';
import { CROP_LIST } from '../../config/crops';
import {
  Factory,
  Users,
  Sprout,
  Clock,
  Calendar,
  Truck,
  CheckCheck,
  Search,
  Filter,
  Scale,
  Receipt,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { navigate } from '../../utils/navigation';

export const FactoryDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { crops, procurements, factories } = useAppData();

  // Active factory details
  const activeFactory =
    factories.find((f) => f.id === currentUser?.id || f.name.includes(currentUser?.name || '')) ||
    factories[0];

  // Filters for Procurement Queue
  const [searchQuery, setSearchQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal handlers
  const [transportTarget, setTransportTarget] = useState<ProcurementRecord | null>(null);
  const [qualityTarget, setQualityTarget] = useState<ProcurementRecord | null>(null);
  const [billingTarget, setBillingTarget] = useState<ProcurementRecord | null>(null);

  // Metrics (Requirement 15)
  const uniqueFarmersCount = new Set(crops.map((c) => c.farmerId)).size;
  const verifiedCropsCount = crops.filter((c) => c.status === 'Verified').length;
  const pendingProcurementCount = verifiedCropsCount - procurements.length;
  const scheduledCount = procurements.filter(
    (p) => p.currentStatus === 'Procurement Scheduled' || p.currentStatus === 'Harvest Scheduled'
  ).length;
  const activeProcurementCount = procurements.filter(
    (p) => p.currentStatus !== 'Completed'
  ).length;
  const completedCount = procurements.filter((p) => p.currentStatus === 'Completed').length;

  const filteredQueue = procurements.filter((proc) => {
    const matchesSearch =
      proc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proc.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proc.batchNumber && proc.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCrop = cropFilter === 'all' || proc.cropType === cropFilter;
    const matchesStatus = statusFilter === 'all' || proc.currentStatus === statusFilter;

    return matchesSearch && matchesCrop && matchesStatus;
  });

  // Prototype factory optimization insights
  const factoryInsights = SmartInsightsService.generateFactoryOptimization(
    procurements.length,
    activeFactory.dailyCapacityTons
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12281A] rounded-3xl text-[#F3EFE4] p-6 sm:p-8 border border-[#244532] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173522] border border-[#244532] text-[#D97824] text-xs font-semibold mb-2 font-sans">
            <Factory className="w-3.5 h-3.5 text-[#D97824]" />
            <span>Industrial Procurement &amp; Milling Operations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#F3EFE4]">
            {activeFactory.name}
          </h2>
          <p className="text-[#EBE5D6]/80 text-xs sm:text-sm mt-1 font-sans">
            Zone: {activeFactory.district}, {activeFactory.state} • Daily Intake Capacity: {activeFactory.dailyCapacityTons} TCD
          </p>
        </div>

        <button
          onClick={() => navigate('/factory/procurement')}
          className="px-5 py-3 bg-[#D97824] hover:bg-[#c2671b] text-white rounded-2xl font-bold text-xs shadow-sm transition flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer font-sans"
        >
          <span>Manage Full Queue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards (Requirement 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 font-sans">
        <div className="bg-[#EBE5D6] p-4 rounded-2xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-1">
            <span className="text-[11px] font-semibold text-[#173522]">Total Farmers</span>
            <Users className="w-4 h-4 text-[#173522]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#173522]">{uniqueFarmersCount}</p>
          <span className="text-[10px] text-[#777268]">In catchment area</span>
        </div>

        <div className="bg-[#EBE5D6] p-4 rounded-2xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-1">
            <span className="text-[11px] font-semibold text-[#173522]">Verified Crops</span>
            <Sprout className="w-4 h-4 text-[#173522]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#173522]">{verifiedCropsCount}</p>
          <span className="text-[10px] text-[#777268]">Ready for intake</span>
        </div>

        <div className="bg-[#EBE5D6] p-4 rounded-2xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-1">
            <span className="text-[11px] font-semibold text-[#173522]">Pending Intake</span>
            <Clock className="w-4 h-4 text-[#D97824]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#D97824]">{Math.max(0, pendingProcurementCount)}</p>
          <span className="text-[10px] text-[#777268]">Awaiting schedule</span>
        </div>

        <div className="bg-[#EBE5D6] p-4 rounded-2xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-1">
            <span className="text-[11px] font-semibold text-[#173522]">Scheduled</span>
            <Calendar className="w-4 h-4 text-[#173522]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#173522]">{scheduledCount}</p>
          <span className="text-[10px] text-[#777268]">Dates allocated</span>
        </div>

        <div className="bg-[#EBE5D6] p-4 rounded-2xl border border-[#DFD7C4] shadow-xs">
          <div className="flex items-center justify-between text-[#777268] mb-1">
            <span className="text-[11px] font-semibold text-[#173522]">Active Transit</span>
            <Truck className="w-4 h-4 text-[#D97824]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#D97824]">{activeProcurementCount}</p>
          <span className="text-[10px] text-[#777268]">En route / yard</span>
        </div>

        <div className="bg-[#EBE5D6] p-4 rounded-2xl border border-[#DFD7C4] shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#777268] mb-1">
            <span className="text-[11px] font-semibold text-[#173522]">Completed</span>
            <CheckCheck className="w-4 h-4 text-[#173522]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#173522]">{completedCount}</p>
          <span className="text-[10px] text-[#777268]">Billed &amp; settled</span>
        </div>
      </div>

      {/* Main Procurement Queue Section (Requirement 15) */}
      <div className="bg-white p-6 rounded-3xl border border-[#DFD7C4] shadow-xs space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-serif font-bold text-[#173522] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D97824]" />
              <span>Active Procurement Queue</span>
            </h3>
            <p className="text-xs text-[#777268] mt-0.5">
              Live batch sequencing from farm pickup to electronic weighment and computerized payout.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#777268] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lot, farmer..."
                className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 focus:bg-white text-[#171713] focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs p-1.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 text-[#171713] focus:bg-white"
            >
              <option value="all">All Stages</option>
              <option value="Procurement Scheduled">Procurement Scheduled</option>
              <option value="Transport Assigned">Transport Assigned</option>
              <option value="In Transit">In Transit</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Accepted">Accepted</option>
              <option value="Billing">Billing</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="text-xs p-1.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/50 text-[#171713] focus:bg-white"
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

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F3EFE4] text-[#173522] font-semibold border-b border-[#DFD7C4]">
              <tr>
                <th className="p-3">Farmer &amp; Phone</th>
                <th className="p-3">Crop / Batch</th>
                <th className="p-3">Cultivated Area</th>
                <th className="p-3">Scheduled Date</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Operations Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFD7C4]/60">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#777268]">
                    No active lots in this procurement queue filter.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((proc) => (
                  <tr key={proc.id} className="hover:bg-[#F3EFE4]/60 transition">
                    <td className="p-3">
                      <p className="font-bold text-[#173522]">{proc.farmerName}</p>
                      <span className="font-mono text-[10px] text-[#777268]">
                        {proc.farmerPhone}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-[#171713]">{proc.cropType}</span>
                      <span className="block font-mono text-[10px] text-[#777268]">
                        {proc.batchNumber || proc.id}
                      </span>
                    </td>
                    <td className="p-3 text-[#171713] font-medium">
                      {proc.landArea} {proc.landUnit}
                    </td>
                    <td className="p-3 text-[#777268]">
                      {proc.scheduledDate || 'Not Scheduled'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          proc.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : proc.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-[#F3EFE4] text-[#173522]'
                        }`}
                      >
                        {proc.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={proc.currentStatus} size="sm" />
                    </td>
                    <td className="p-3 text-right space-x-1">
                      {/* Step-appropriate action button */}
                      {(!proc.transport || proc.transport.status !== 'Completed') && (
                        <button
                          onClick={() => setTransportTarget(proc)}
                          className="px-2.5 py-1 bg-[#F3EFE4] hover:bg-[#EBE5D6] text-[#173522] border border-[#DFD7C4] rounded-lg font-semibold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3 h-3 text-[#D97824]" />
                          <span>Transport</span>
                        </button>
                      )}

                      {!proc.weighment && (
                        <button
                          onClick={() => setQualityTarget(proc)}
                          className="px-2.5 py-1 bg-[#173522] hover:bg-[#244532] text-[#F3EFE4] rounded-lg font-semibold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Scale className="w-3 h-3 text-[#D97824]" />
                          <span>Quality &amp; Weigh</span>
                        </button>
                      )}

                      {proc.weighment && (
                        <button
                          onClick={() => setBillingTarget(proc)}
                          className="px-2.5 py-1 bg-[#D97824] hover:bg-[#c2671b] text-white rounded-lg font-semibold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3 h-3" />
                          <span>{proc.bill ? 'Bill Voucher' : 'Generate Bill'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI / Smart Insights for Factory */}
      <SmartInsights
        insights={factoryInsights}
        title="Factory Intake & Logistics Intelligence"
      />

      {/* Operations Modals */}
      {transportTarget && (
        <TransportModal
          isOpen={!!transportTarget}
          onClose={() => setTransportTarget(null)}
          procurement={transportTarget}
        />
      )}

      {qualityTarget && (
        <QualityWeighmentModal
          isOpen={!!qualityTarget}
          onClose={() => setQualityTarget(null)}
          procurement={qualityTarget}
        />
      )}

      {billingTarget && (
        <BillGenerateModal
          isOpen={!!billingTarget}
          onClose={() => setBillingTarget(null)}
          procurement={billingTarget}
        />
      )}
    </div>
  );
};
