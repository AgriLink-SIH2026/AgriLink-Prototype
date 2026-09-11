import React, { useState } from 'react';
import { ProcurementRecord } from '../../types';
import { Modal } from '../common/Modal';
import { SUPPORTED_CROPS } from '../../config/crops';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import { Receipt, CheckCircle, CreditCard, DollarSign } from 'lucide-react';

interface BillGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  procurement: ProcurementRecord;
}

export const BillGenerateModal: React.FC<BillGenerateModalProps> = ({
  isOpen,
  onClose,
  procurement,
}) => {
  const { generateBill, markPaymentPaid } = useAppData();
  const { showToast } = useToast();

  const netWeight = procurement.weighment?.netWeightKg || 0;
  const benchmarkRate = SUPPORTED_CROPS[procurement.cropType]?.benchmarkPricePerKg || 3.4;

  const [ratePerKg, setRatePerKg] = useState<number>(
    procurement.bill?.ratePerKg || benchmarkRate
  );
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Processing' | 'Paid'>(
    procurement.bill?.paymentStatus || 'Paid'
  );
  const [transactionRef, setTransactionRef] = useState(
    procurement.bill?.transactionRef ||
      `RTGS/SBI/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/${Math.floor(
        10000000 + Math.random() * 90000000
      )}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REAL AUTOMATIC CALCULATION: Total Amount = Net Weight * Rate
  const totalAmount = Math.round(netWeight * ratePerKg);

  const handleGenerateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (netWeight <= 0) {
      showToast('Certified Net Weight must be recorded before generating a bill.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Generate/update bill
      await generateBill(procurement.id, ratePerKg);

      // Step 2: If marked paid, process payment
      if (paymentStatus === 'Paid') {
        await markPaymentPaid(procurement.id, transactionRef);
        // Confetti celebration for completed payment!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        showToast(
          `Bill generated and payment of ₹${totalAmount.toLocaleString('en-IN')} marked as PAID!`,
          'success'
        );
      } else {
        showToast(
          `Digital bill generated for ₹${totalAmount.toLocaleString('en-IN')} (${paymentStatus}).`,
          'success'
        );
      }

      onClose();
    } catch (err) {
      showToast('Error processing bill and payment.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Electronic Procurement Billing & Payment Voucher"
      subtitle={`Procurement Lot: ${procurement.id} (${procurement.cropType})`}
      maxWidth="lg"
    >
      <form onSubmit={handleGenerateOrUpdate} className="space-y-6">
        {/* Certified Weight Banner */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Beneficiary Farmer</span>
            <p className="font-bold text-slate-900 text-sm">{procurement.farmerName}</p>
            <p className="text-xs text-slate-500">Quality: {procurement.quality?.grade || 'Grade A'}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Certified Net Weight</span>
            <p className="font-mono text-base font-extrabold text-emerald-800">
              {netWeight.toLocaleString('en-IN')} kg
            </p>
            <p className="text-[11px] text-slate-400">({(netWeight / 1000).toFixed(2)} MT)</p>
          </div>
        </div>

        {/* Rate & Calculation */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Procurement Rate per kg (₹ / kg)
            </label>
            <input
              type="number"
              step="0.05"
              value={ratePerKg}
              onChange={(e) => setRatePerKg(Number(e.target.value))}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 font-mono font-bold"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Government / Mill FRP benchmark: ₹{benchmarkRate.toFixed(2)}/kg
            </p>
          </div>

          {/* REAL AUTOMATIC CALCULATION CARD */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                Total Bill Amount (Net Weight &times; Rate):
              </span>
              <p className="text-xs text-emerald-700 mt-0.5">
                {netWeight.toLocaleString('en-IN')} kg &times; ₹{ratePerKg.toFixed(2)}/kg
              </p>
            </div>
            <div className="text-right font-mono text-2xl font-black text-emerald-900">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Payment Settlement Option */}
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <label className="text-xs font-bold text-slate-800 block">Payment Settlement Status</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Pending', 'Processing', 'Paid'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setPaymentStatus(status)}
                className={`p-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                  paymentStatus === status
                    ? status === 'Paid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{status}</span>
              </button>
            ))}
          </div>

          {paymentStatus === 'Paid' && (
            <div className="pt-2 animate-in fade-in">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Banking UTR / Transaction Reference
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                placeholder="RTGS/NEFT Transaction ID"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            {isSubmitting ? 'Processing...' : 'Confirm & Issue Digital Bill'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
