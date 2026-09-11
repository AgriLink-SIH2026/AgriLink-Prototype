import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { BillGenerateModal } from '../../components/factory/BillGenerateModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProcurementRecord } from '../../types';
import { Receipt, CheckCircle, Search, DollarSign, ArrowUpRight } from 'lucide-react';

export const FactoryBilling: React.FC = () => {
  const { procurements } = useAppData();
  const [selectedProcurement, setSelectedProcurement] = useState<ProcurementRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const eligibleForBilling = procurements.filter((p) => p.weighment && p.weighment.netWeightKg > 0);

  const filtered = eligibleForBilling.filter((p) => {
    const q = searchQuery.toLowerCase();
    const invoice = p.bill?.billNumber.toLowerCase() || '';
    const farmer = p.farmerName.toLowerCase();
    const crop = p.cropType.toLowerCase();
    return invoice.includes(q) || farmer.includes(q) || crop.includes(q);
  });

  const totalDisbursed = eligibleForBilling
    .filter((p) => p.bill?.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + (p.bill?.totalAmount || 0), 0);

  const pendingDisbursement = eligibleForBilling
    .filter((p) => p.bill?.paymentStatus !== 'Paid')
    .reduce((sum, p) => sum + (p.bill?.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
          <Receipt className="w-3.5 h-3.5 text-amber-700" />
          <span>Section 21 • Financial Settlement &amp; Billing</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Procurement Billing &amp; Invoices
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Issue computerized procurement invoices calculated from certified net weighbridge weights, and update payment settlement status.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Total Paid Disbursements
          </span>
          <p className="font-mono text-2xl font-extrabold text-emerald-600">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Cleared via bank RTGS</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Pending / In-Process Payouts
          </span>
          <p className="font-mono text-2xl font-extrabold text-amber-600">
            ₹{pendingDisbursement.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting treasury release</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block mb-1">
            Total Invoices Issued
          </span>
          <p className="font-mono text-2xl font-extrabold text-slate-900">
            {eligibleForBilling.filter((p) => p.bill).length}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Digital vouchers</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice number, farmer, or crop..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Beneficiary Farmer</th>
                <th className="p-3.5">Crop &amp; Quality</th>
                <th className="p-3.5">Certified Quantity</th>
                <th className="p-3.5">Rate / kg</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No weighbridge certified lots available for billing in this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((proc) => {
                  const bill = proc.bill;
                  return (
                    <tr key={proc.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {bill ? bill.billNumber : 'Unbilled'}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Dated: {bill ? bill.date : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{proc.farmerName}</p>
                        <span className="font-mono text-[10px] text-slate-500">
                          {proc.farmerPhone}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800">{proc.cropType}</span>
                        <span className="block text-[10px] text-slate-400">
                          Grade: {proc.quality?.grade || 'Tested'}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-800">
                        {proc.weighment?.netWeightKg.toLocaleString()} kg
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">
                        {bill ? `₹${bill.ratePerKg.toFixed(2)}` : 'TBD'}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-800 text-sm">
                        {bill ? `₹${bill.totalAmount.toLocaleString('en-IN')}` : 'TBD'}
                      </td>
                      <td className="p-3.5">
                        <StatusBadge status={bill?.paymentStatus || 'Pending'} size="sm" />
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedProcurement(proc)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition inline-flex items-center gap-1 shadow-xs"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>{bill ? 'Manage Payment' : 'Issue Bill'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProcurement && (
        <BillGenerateModal
          isOpen={!!selectedProcurement}
          onClose={() => setSelectedProcurement(null)}
          procurement={selectedProcurement}
        />
      )}
    </div>
  );
};
