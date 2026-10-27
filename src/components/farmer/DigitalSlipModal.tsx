import React, { useRef } from 'react';
import { DigitalSlip } from '../../types';
import { SlotService } from '../../services/slotService';
import { getVehicleStatusBadge } from '../../services/digitalSlipService';
import {
  X,
  Printer,
  QrCode,
  Building2,
  Calendar,
  Clock,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface DigitalSlipModalProps {
  slip: DigitalSlip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateVehicleClick?: () => void;
}

export const DigitalSlipModal: React.FC<DigitalSlipModalProps> = ({
  slip,
  isOpen,
  onClose,
  onUpdateVehicleClick,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !slip) return null;

  const vehicleBadge = getVehicleStatusBadge(slip.vehicleNumber, slip.slotStart);
  const formattedWindow = SlotService.format24HourWindow(slip.slotStart, slip.slotEnd);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132619]/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#DFD7C4] animate-in fade-in zoom-in duration-150 my-8">
        {/* Header Bar */}
        <div className="bg-[#173522] text-[#EBE5D6] p-5 flex items-center justify-between border-b border-[#244532]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D97824] flex items-center justify-center text-white font-serif font-black text-base shadow-xs">
              A
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D97824] block">
                AGRILINK FACTORY GATE PASS
              </span>
              <h3 className="font-serif text-lg font-bold text-white">Online Digital Slip</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#EBE5D6]/80 hover:text-white hover:bg-[#244532] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div ref={printRef} className="p-6 space-y-5 bg-[#FAF7F0] print:p-0 print:bg-white text-[#171713]">
          {/* Slip ID & Status Banner */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#DFD7C4] shadow-2xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777268] block">
                Slip ID / Pass Number
              </span>
              <span className="font-mono text-lg font-extrabold text-[#173522] tracking-tight">
                {slip.slipId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777268] block">
                Status
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active Pass
              </span>
            </div>
          </div>

          {/* 24-Hour Slot Window Banner */}
          <div className="bg-[#173522] text-[#EBE5D6] p-4 rounded-2xl border border-[#244532] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#D97824] font-bold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                24-HOUR INTAKE WINDOW
              </span>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-[#244532] text-white">
                Valid 24h
              </span>
            </div>
            <p className="font-serif text-sm sm:text-base font-bold text-white tracking-tight">
              {formattedWindow}
            </p>
          </div>

          {/* Gate Verification QR Code & Payload Representation */}
          <div className="bg-white p-5 rounded-2xl border border-[#DFD7C4] flex flex-col sm:flex-row items-center gap-5 shadow-2xs">
            <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#DFD7C4] shrink-0 flex flex-col items-center">
              {/* Generated SVG QR Code representation */}
              <svg
                viewBox="0 0 120 120"
                className="w-28 h-28 text-[#173522]"
                fill="currentColor"
              >
                {/* Simulated QR matrix corners & patterns */}
                <rect x="10" y="10" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="20" y="20" width="10" height="10" rx="1" />
                <rect x="80" y="10" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="90" y="20" width="10" height="10" rx="1" />
                <rect x="10" y="80" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="20" y="90" width="10" height="10" rx="1" />
                {/* Data dots */}
                <rect x="50" y="15" width="8" height="8" />
                <rect x="62" y="15" width="8" height="8" />
                <rect x="50" y="27" width="8" height="8" />
                <rect x="15" y="50" width="8" height="8" />
                <rect x="27" y="50" width="8" height="8" />
                <rect x="50" y="50" width="20" height="20" rx="3" fill="#D97824" />
                <rect x="80" y="50" width="8" height="8" />
                <rect x="92" y="50" width="8" height="8" />
                <rect x="80" y="62" width="8" height="8" />
                <rect x="50" y="80" width="8" height="8" />
                <rect x="62" y="92" width="8" height="8" />
                <rect x="80" y="80" width="10" height="10" />
                <rect x="95" y="80" width="15" height="10" />
                <rect x="80" y="95" width="30" height="15" />
              </svg>
              <span className="text-[9px] font-mono text-[#777268] mt-1.5 uppercase tracking-wider">
                Factory Scanner Valid
              </span>
            </div>

            <div className="space-y-2 text-xs flex-1 w-full">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777268] block">
                  Processing Factory
                </span>
                <p className="font-serif font-bold text-[#173522] text-sm flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#D97824]" />
                  <span>{slip.factoryName}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777268] block">
                    Farmer Name
                  </span>
                  <p className="font-semibold text-[#171713]">{slip.farmerName}</p>
                  <p className="text-[10px] text-[#777268] font-mono">{slip.farmerPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#777268] block">
                    Crop &amp; Quantity
                  </span>
                  <p className="font-semibold text-[#171713]">
                    {slip.cropType} • <span className="font-bold text-[#D97824]">{slip.quantityTons} Tons</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Registration Section */}
          <div className={`p-4 rounded-2xl border ${
            vehicleBadge.isPending
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-white border-emerald-300 text-[#171713]'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  vehicleBadge.isPending ? 'bg-amber-200 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block text-[#777268]">
                    Vehicle Registration Number
                  </span>
                  {vehicleBadge.isPending ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-bold text-xs text-amber-900">
                        Pending - Required 6h prior
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-base font-extrabold text-[#173522] tracking-wider">
                      {slip.vehicleNumber}
                    </span>
                  )}
                </div>
              </div>

              {vehicleBadge.isPending && onUpdateVehicleClick && (
                <button
                  onClick={onUpdateVehicleClick}
                  className="px-3.5 py-1.5 bg-[#D97824] hover:bg-[#c3681b] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Update Vehicle
                </button>
              )}
            </div>

            {vehicleBadge.isPending && (
              <p className="text-[11px] text-amber-800 mt-2 pl-12 leading-relaxed">
                * Note: Under factory gate security protocol, entry verification will be blocked if a vehicle number is not recorded at least 6 hours before slot commencement.
              </p>
            )}
          </div>

          {/* QR Payload Technical Audit String */}
          <div className="p-3 bg-[#EBE5D6]/60 rounded-xl border border-[#DFD7C4] text-[10px] font-mono text-[#777268] break-all">
            <span className="font-bold text-[#173522] block mb-0.5">QR Verified Payload Hash:</span>
            {JSON.stringify(slip.qrCodePayload)}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-[#DFD7C4] flex items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777268] hover:bg-[#FAF7F0] transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D97824]" />
              <span>Print / Save Slip (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
