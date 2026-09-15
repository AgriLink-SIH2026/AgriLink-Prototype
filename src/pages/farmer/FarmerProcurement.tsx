import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Timeline } from '../../components/common/Timeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { BillReceiptModal } from '../../components/farmer/BillReceiptModal';
import { WorkflowEngine } from '../../services/workflowEngine';
import { ProcurementRecord } from '../../types';
import { navigate } from '../../utils/navigation';
import {
  Milestone,
  Scale,
  Receipt,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck,
  Award,
  Archive,
  ArrowUpRight,
} from 'lucide-react';

export const FarmerProcurement: React.FC = () => {
  const { currentUser } = useAuth();
  const { procurements } = useAppData();

  const [selectedBillProcurement, setSelectedBillProcurement] =
    useState<ProcurementRecord | null>(null);

  // Filter procurements belonging to current farmer
  const myProcurements = currentUser
    ? procurements.filter(
        (p) => p.farmerId === currentUser.id || p.farmerName === currentUser.name
      )
    : [];

  // Split into Active and Completed (Historical)
  const activeProcurements = myProcurements.filter((p) => p.currentStatus !== 'Completed');
  const completedProcurements = myProcurements.filter((p) => p.currentStatus === 'Completed');

  const [selectedActiveId, setSelectedActiveId] = useState<string>(
    activeProcurements[0]?.id || myProcurements[0]?.id || ''
  );

  const activeRecord = myProcurements.find((p) => p.id === selectedActiveId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EFE4] border border-[#DFD7C4] text-[#173522] text-xs font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D97824]" />
          Procurement Transparency &amp; Traceability
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#173522] tracking-tight">
          Procurement Status &amp; History
        </h2>
        <p className="text-xs font-sans text-[#777268] mt-1">
          Follow your harvest from factory intake scheduling to certified weighment and bank settlement.
        </p>
      </div>

      {myProcurements.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DFD7C4] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F3EFE4] border border-[#DFD7C4] flex items-center justify-center mx-auto mb-3">
            <Milestone className="w-7 h-7 text-[#D97824]" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#173522]">No active procurements yet</h3>
          <p className="text-xs font-sans text-[#777268] mt-1 max-w-md mx-auto">
            Register a crop, compare processor bids, and book an intake slot to begin procurement.
          </p>
          <button
            onClick={() => navigate('/farmer/crops')}
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#173522] text-[#F3EFE4] rounded-xl text-xs font-bold hover:bg-[#244532] transition cursor-pointer"
          >
            Check Registered Crops
          </button>
        </div>
      ) : (
        <>
          {/* Active Procurement Selector Tabs */}
          {myProcurements.length > 1 && (
            <div className="flex flex-wrap gap-2 pb-2 font-sans">
              {myProcurements.map((proc) => (
                <button
                  key={proc.id}
                  onClick={() => setSelectedActiveId(proc.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                    selectedActiveId === proc.id
                      ? 'bg-[#173522] text-[#F3EFE4] border-[#173522] shadow-sm'
                      : 'bg-[#F3EFE4] text-[#171713] border-[#DFD7C4] hover:bg-[#EBE5D6]'
                  }`}
                >
                  <span>
                    {proc.cropType} (Batch: {proc.batchNumber || proc.id})
                  </span>
                  <StatusBadge status={proc.currentStatus} size="sm" />
                </button>
              ))}
            </div>
          )}

          {/* Active Procurement Details Card */}
          {activeRecord && (
            <div className="bg-white rounded-3xl border border-[#DFD7C4] shadow-xs overflow-hidden">
              {/* Card Header */}
              <div className="p-6 bg-[#12281A] text-[#F3EFE4] border-b border-[#244532] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#D97824]">
                    Procurement Lot #{activeRecord.id}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-0.5">
                    {activeRecord.cropType} ({activeRecord.variety})
                  </h3>
                  <p className="text-xs text-[#EBE5D6]/80 font-sans mt-1 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#D97824]" />
                    <span>Processing Factory: <strong className="text-white font-medium">{activeRecord.factoryName}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#EBE5D6]/80 block mb-1 tracking-wider">
                      Current Milestone
                    </span>
                    <StatusBadge status={activeRecord.currentStatus} />
                  </div>
                </div>
              </div>

              {/* Guidance & Next Step Banner */}
              <div className="p-4 bg-[#F3EFE4] border-b border-[#DFD7C4] flex flex-wrap items-center justify-between gap-3 text-xs text-[#173522] font-sans">
                <div>
                  <span className="font-bold text-[#D97824]">Next Action: </span>
                  <span className="text-[#171713]">{WorkflowEngine.getNextStepGuidance(activeRecord.currentStatus)}</span>
                </div>
                {activeRecord.scheduledDate && (
                  <span className="text-[11px] text-[#173522] font-mono shrink-0 bg-white px-2.5 py-1 rounded-lg border border-[#DFD7C4]">
                    Target Date: {activeRecord.scheduledDate}
                  </span>
                )}
              </div>

              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Interactive Visual Timeline */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#777268]">
                    Visual Procurement Lifecycle
                  </h4>
                  <Timeline
                    currentStatus={activeRecord.currentStatus}
                    statusHistory={activeRecord.statusHistory}
                  />
                </div>

                {/* Right 1 Col: Quality, Weighment & Billing Certificates */}
                <div className="space-y-5 lg:border-l lg:border-[#DFD7C4] lg:pl-8 font-sans">
                  {/* Quality Card */}
                  {activeRecord.quality ? (
                    <div className="p-4.5 rounded-2xl bg-[#F3EFE4] border border-[#DFD7C4] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#173522] flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#173522]" />
                          <span>Quality Certificate</span>
                        </span>
                        <span className="text-xs font-bold text-[#173522] bg-white px-2.5 py-0.5 rounded-lg border border-[#DFD7C4]">
                          {activeRecord.quality.grade}
                        </span>
                      </div>
                      <div className="text-xs text-[#171713] space-y-1">
                        {activeRecord.quality.brixPercentage && (
                          <p>
                            <strong className="text-[#173522]">Brix Sucrose:</strong> {activeRecord.quality.brixPercentage}%
                          </p>
                        )}
                        {activeRecord.quality.stapleLengthMm && (
                          <p>
                            <strong className="text-[#173522]">Staple Length:</strong> {activeRecord.quality.stapleLengthMm} mm
                          </p>
                        )}
                        {activeRecord.quality.oilContentPercentage && (
                          <p>
                            <strong className="text-[#173522]">Oil Content:</strong> {activeRecord.quality.oilContentPercentage}%
                          </p>
                        )}
                        {activeRecord.quality.moisturePercentage && (
                          <p>
                            <strong className="text-[#173522]">Moisture / Foreign:</strong>{' '}
                            {activeRecord.quality.moisturePercentage}%
                          </p>
                        )}
                        <p className="text-[11px] text-[#777268] italic pt-1 font-serif">
                          &ldquo;{activeRecord.quality.remarks}&rdquo;
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4.5 rounded-2xl border border-dashed border-[#DFD7C4] bg-[#F3EFE4]/40 text-center text-xs text-[#777268] font-sans">
                      Laboratory quality testing will take place upon mill yard arrival.
                    </div>
                  )}

                  {/* Certified Weighment Card */}
                  {activeRecord.weighment ? (
                    <div className="p-4.5 rounded-2xl bg-[#F3EFE4] border border-[#DFD7C4] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#173522] flex items-center gap-1.5">
                          <Scale className="w-4 h-4 text-[#173522]" />
                          <span>Weighbridge Slip</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#777268]">
                          {activeRecord.weighment.slipNumber}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-[10px] text-[#777268] block tracking-wider uppercase">Gross Weight</span>
                          <span className="font-mono font-medium text-[#171713]">
                            {activeRecord.weighment.grossWeightKg.toLocaleString()} kg
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#777268] block tracking-wider uppercase">Tare Weight</span>
                          <span className="font-mono font-medium text-[#171713]">
                            {activeRecord.weighment.tareWeightKg.toLocaleString()} kg
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-[#DFD7C4] flex items-center justify-between">
                        <span className="text-xs font-bold text-[#173522]">Certified Net Weight:</span>
                        <span className="font-mono text-base font-extrabold text-[#173522]">
                          {activeRecord.weighment.netWeightKg.toLocaleString()} kg
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4.5 rounded-2xl border border-dashed border-[#DFD7C4] bg-[#F3EFE4]/40 text-center text-xs text-[#777268] font-sans">
                      Electronic weighbridge ticket pending vehicle check-in.
                    </div>
                  )}

                  {/* Billing Card */}
                  {activeRecord.bill ? (
                    <div className="p-5 rounded-3xl bg-[#12281A] text-[#F3EFE4] border border-[#244532] space-y-3 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#D97824]">
                          Digital Bill
                        </span>
                        <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-[#F3EFE4] border border-white/10">
                          {activeRecord.bill.billNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#EBE5D6]/80 block tracking-wider uppercase">Net Payable Amount</span>
                        <p className="font-mono text-2xl font-black text-white">
                          ₹{activeRecord.bill.totalAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-[#EBE5D6]/80 mt-0.5">
                          Status:{' '}
                          <strong className="text-[#D97824] uppercase font-bold">
                            {activeRecord.bill.paymentStatus}
                          </strong>
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedBillProcurement(activeRecord)}
                        className="w-full py-2.5 bg-[#D97824] hover:bg-[#c2671b] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Full Bill Voucher</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4.5 rounded-2xl border border-dashed border-[#DFD7C4] bg-[#F3EFE4]/40 text-center text-xs text-[#777268] font-sans">
                      Digital invoice voucher generated upon consignment acceptance.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Historical Records Section (Requirement 36) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DFD7C4] shadow-xs space-y-4 font-sans">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#173522] flex items-center gap-2">
                <Archive className="w-4 h-4 text-[#D97824]" />
                <span>Permanent Digital Procurement History</span>
              </h3>
              <span className="text-xs text-[#777268] font-medium">
                {completedProcurements.length} Completed Records
              </span>
            </div>

            {completedProcurements.length === 0 ? (
              <p className="text-xs text-[#777268] py-6 text-center">
                No archived procurements yet. When payments are confirmed as Paid, records are permanently saved here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F3EFE4] text-[#173522] font-semibold border-b border-[#DFD7C4]">
                    <tr>
                      <th className="p-3">Crop &amp; Batch</th>
                      <th className="p-3">Processing Factory</th>
                      <th className="p-3">Certified Quantity</th>
                      <th className="p-3">Quality Grade</th>
                      <th className="p-3">Total Payout</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFD7C4]/60">
                    {completedProcurements.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F3EFE4]/60 transition">
                        <td className="p-3">
                          <p className="font-bold text-[#173522]">
                            {rec.cropType} ({rec.variety})
                          </p>
                          <span className="font-mono text-[10px] text-[#777268]">
                            Batch: {rec.batchNumber || rec.id}
                          </span>
                        </td>
                        <td className="p-3 text-[#171713] font-medium">{rec.factoryName}</td>
                        <td className="p-3 font-mono text-[#171713]">
                          {rec.weighment?.netWeightKg.toLocaleString()} kg
                          <span className="block text-[10px] text-[#777268]">
                            ({((rec.weighment?.netWeightKg || 0) / 1000).toFixed(2)} MT)
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-[#F3EFE4] text-[#173522] font-semibold border border-[#DFD7C4] text-[11px]">
                            {rec.quality?.grade || 'Standard'}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-[#173522] text-sm">
                          ₹{rec.bill?.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={rec.bill?.paymentStatus || 'Paid'} size="sm" />
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedBillProcurement(rec)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#D97824] hover:bg-[#F3EFE4] rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Bill</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bill Receipt Modal */}
      {selectedBillProcurement && (
        <BillReceiptModal
          isOpen={!!selectedBillProcurement}
          onClose={() => setSelectedBillProcurement(null)}
          procurement={selectedBillProcurement}
        />
      )}
    </div>
  );
};
