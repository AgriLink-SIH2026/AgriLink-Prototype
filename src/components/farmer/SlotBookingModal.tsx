import React, { useState } from 'react';
import { CropRegistration, Slot, CropType } from '../../types';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { SlotService } from '../../services/slotService';
import {
  X,
  Calendar,
  Clock,
  Building2,
  Sprout,
  Truck,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Scale,
  Loader2,
} from 'lucide-react';

interface SlotBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedSlotId?: string;
  preselectedCropId?: string;
}

export const SlotBookingModal: React.FC<SlotBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedSlotId,
  preselectedCropId,
}) => {
  const { crops, slots, factories, bookSlot } = useAppData();
  const { showToast } = useToast();

  const [selectedCropId, setSelectedCropId] = useState<string>(
    preselectedCropId || crops[0]?.id || ''
  );
  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  const defaultHarvest = selectedCrop
    ? selectedCrop.expectedHarvestDate
    : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [harvestDate, setHarvestDate] = useState<string>(defaultHarvest);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    preselectedSlotId || slots[0]?.id || ''
  );
  const [quantityTons, setQuantityTons] = useState<number>(10);
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter slots for the selected crop or active factory
  const availableSlots = slots.filter((s) => s.status === 'AVAILABLE' && s.availableCapacityTons > 0);
  const currentSlot = slots.find((s) => s.id === selectedSlotId) || availableSlots[0];

  // Advance Window Lock Real-Time Validation
  const windowValidation = SlotService.validateAdvanceWindowLock(harvestDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentSlot) {
      setErrorMessage('Please select an intake slot.');
      return;
    }

    if (!selectedCrop) {
      setErrorMessage('Please register or select a crop first.');
      return;
    }

    if (!windowValidation.allowed) {
      setErrorMessage(windowValidation.reason || 'Advance Window Lock violation: Booking restricted.');
      return;
    }

    if (quantityTons <= 0 || quantityTons > currentSlot.availableCapacityTons) {
      setErrorMessage(`Quantity must be between 1 and ${currentSlot.availableCapacityTons} Tons.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await bookSlot({
        slotId: currentSlot.id,
        cropRegistrationId: selectedCrop.id,
        cropType: selectedCrop.cropType,
        quantityTons,
        harvestDate,
        vehicleNumber: vehicleNumber.trim() ? vehicleNumber.trim().toUpperCase() : null,
      });

      showToast(`Slot booked successfully! Gate Pass #${booking.digitalSlipId} issued.`, 'success');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to book slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132619]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#DFD7C4] animate-in fade-in zoom-in duration-150 my-8">
        {/* Modal Header */}
        <div className="bg-[#173522] text-[#EBE5D6] p-5 flex items-center justify-between border-b border-[#244532]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D97824] flex items-center justify-center text-white font-serif font-black text-base shadow-xs">
              24h
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97824] block">
                FACTORY INTAKE SCHEDULER
              </span>
              <h3 className="font-serif text-lg font-bold text-white">Book 24-Hour Intake Slot</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#EBE5D6]/80 hover:text-white hover:bg-[#244532] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans text-[#171713]">
          {/* 1. Advance Window Lock Notice & Harvest Date Selector */}
          <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#DFD7C4] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#173522] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#D97824]" />
                <span>Planned Harvest Date</span>
              </label>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                windowValidation.allowed
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {windowValidation.allowed ? '✓ Within 7-Day Window' : '🔒 Advance Locked (> 7 days)'}
              </span>
            </div>

            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7C4] bg-white font-sans text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#173522]"
            />

            {!windowValidation.allowed && (
              <p className="text-[11px] text-amber-800 flex items-start gap-1.5 pt-1 leading-snug">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>{windowValidation.reason}</span>
              </p>
            )}
          </div>

          {/* 2. Select Crop from Registered Lots */}
          <div>
            <label className="block text-xs font-bold text-[#171713] mb-1">
              Select Registered Crop
            </label>
            {crops.length === 0 ? (
              <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                No crops registered yet. Please register a crop first.
              </p>
            ) : (
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#FAF7F0] font-sans text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#173522]"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cropType} ({c.variety}) • {c.landArea} {c.landUnit} • ID: {c.id}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 3. 24-Hour Slot Selector */}
          <div>
            <label className="block text-xs font-bold text-[#171713] mb-1.5 flex items-center justify-between">
              <span>Available 24-Hour Intake Slots</span>
              <span className="text-[10px] text-[#777268] font-normal">
                Strict 24h intake duration
              </span>
            </label>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id || (!selectedSlotId && slot.id === availableSlots[0]?.id);
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#173522] text-white border-[#173522] shadow-sm'
                        : 'bg-[#FAF7F0] text-[#171713] border-[#DFD7C4] hover:bg-[#EBE5D6]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D97824]' : 'text-[#777268]'}`} />
                        <span className="font-bold">{slot.factoryName}</span>
                      </div>
                      <p className={`text-[11px] ${isSelected ? 'text-[#EBE5D6]/90' : 'text-[#777268]'}`}>
                        {SlotService.format24HourWindow(slot.slotStart, slot.slotEnd)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isSelected ? 'text-[#D97824]' : 'text-[#777268]'
                      }`}>
                        Capacity Left
                      </span>
                      <span className="font-mono font-bold text-xs">
                        {slot.availableCapacityTons} / {slot.totalCapacityTons} Tons
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Quantity & Optional Vehicle Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#171713] mb-1">
                Produce Quantity (Tons)
              </label>
              <input
                type="number"
                min="1"
                max={currentSlot?.availableCapacityTons || 50}
                value={quantityTons}
                onChange={(e) => setQuantityTons(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#FAF7F0] font-sans text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#173522]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171713] mb-1 flex items-center justify-between">
                <span>Vehicle Number</span>
                <span className="text-[10px] text-[#777268] font-normal">Optional initially</span>
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="Can update later (T - 6h)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#FAF7F0] font-mono text-xs font-bold tracking-wider uppercase focus:outline-hidden focus:ring-2 focus:ring-[#173522]"
              />
            </div>
          </div>

          {/* Error display */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#DFD7C4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#777268] hover:bg-[#FAF7F0] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !windowValidation.allowed}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Reserving Slot...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D97824]" />
                  <span>Confirm 24h Slot Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
