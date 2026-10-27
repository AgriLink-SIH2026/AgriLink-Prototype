import React, { useState } from 'react';
import { Booking } from '../../types';
import { SlotService } from '../../services/slotService';
import {
  X,
  Truck,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface VehicleUpdateModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookingId: string, vehicleNumber: string) => Promise<void>;
}

export const VehicleUpdateModal: React.FC<VehicleUpdateModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSave,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState(booking?.vehicleNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state on booking change
  React.useEffect(() => {
    if (booking) {
      setVehicleNumber(booking.vehicleNumber || '');
      setErrorMessage(null);
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const isLocked = SlotService.isWithin6HoursOfSlot(booking.slotStart);
  const slotDate = new Date(booking.slotStart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanNumber = vehicleNumber.trim().toUpperCase();
    if (!cleanNumber) {
      setErrorMessage('Please enter a valid vehicle registration plate number.');
      return;
    }

    if (isLocked) {
      setErrorMessage('Cutoff Deadline Passed: Vehicle details must be submitted at least 6 hours prior to slot start.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(booking.id, cleanNumber);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update vehicle registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132619]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#DFD7C4] animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-[#173522] text-[#EBE5D6] p-5 flex items-center justify-between border-b border-[#244532]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D97824] flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97824] block">
                GATE PASS VERIFICATION
              </span>
              <h3 className="font-serif text-lg font-bold text-white">Update Vehicle Number</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#EBE5D6]/80 hover:text-white hover:bg-[#244532] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans text-[#171713]">
          {/* Slot Context Card */}
          <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#DFD7C4] space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#777268]">
              <span>Booking ID: <strong className="text-[#171713]">{booking.id}</strong></span>
              <span className="font-bold text-[#D97824]">{booking.cropType}</span>
            </div>
            <div className="flex items-center gap-2 text-[#173522] font-semibold">
              <Clock className="w-4 h-4 text-[#D97824] shrink-0" />
              <span>
                Slot Starts: {slotDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at{' '}
                {slotDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>

          {/* 6-Hour Deadline Notice */}
          <div className={`p-3.5 rounded-2xl text-xs border flex items-start gap-2.5 ${
            isLocked
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {isLocked ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="leading-relaxed">
              <strong className="block font-bold">
                {isLocked ? '6-Hour Lockout Active' : 'Flexible Registration Policy'}
              </strong>
              {isLocked ? (
                <span>Entry pass changes are locked because current time is within 6 hours of slot commencement.</span>
              ) : (
                <span>You can enter or modify your transport vehicle registration plate up until 6 hours before slot start time (T - 6h).</span>
              )}
            </div>
          </div>

          {/* Vehicle Input Field */}
          <div>
            <label className="block text-xs font-bold text-[#171713] mb-1">
              Transport Vehicle Number (Tractor / Truck / Trolley)
            </label>
            <input
              type="text"
              disabled={isLocked || isSubmitting}
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g. MH-09-EM-4521 or KA-22-T-9840"
              className="w-full px-4 py-3 rounded-xl border border-[#DFD7C4] focus:outline-hidden focus:ring-2 focus:ring-[#173522] font-mono text-sm font-bold tracking-wider uppercase bg-[#FAF7F0] disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            <span className="text-[11px] text-[#777268] mt-1 block">
              Format: State code - District - Series - 4 digits
            </span>
          </div>

          {/* Error display */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#777268] hover:bg-[#FAF7F0] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLocked || isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D97824]" />
                  <span>Confirm Vehicle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
