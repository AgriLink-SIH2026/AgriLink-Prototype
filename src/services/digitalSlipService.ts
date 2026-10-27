import { Booking, DigitalSlip, QRCodePayload } from '../types';

export function generateDigitalSlip(
  booking: Booking,
  factoryName: string
): DigitalSlip {
  // Generate human-friendly, unique slip ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const slipId = `SLIP-2026-${randomSuffix}`;

  const qrCodePayload: QRCodePayload = {
    slip_id: slipId,
    farmer_id: booking.farmerId,
    slot_time: booking.slotStart,
    crop_type: booking.cropType,
    vehicle_number: booking.vehicleNumber || null,
  };

  return {
    id: `slip-${booking.id}`,
    slipId,
    bookingId: booking.id,
    farmerId: booking.farmerId,
    farmerName: booking.farmerName,
    farmerPhone: booking.farmerPhone,
    cropType: booking.cropType,
    quantityTons: booking.quantityTons,
    factoryName,
    slotStart: booking.slotStart,
    slotEnd: booking.slotEnd,
    vehicleNumber: booking.vehicleNumber || null,
    qrCodePayload,
    createdAt: new Date().toISOString(),
  };
}

export function updateSlipVehicle(
  slip: DigitalSlip,
  vehicleNumber: string
): DigitalSlip {
  const updatedQrPayload: QRCodePayload = {
    ...slip.qrCodePayload,
    vehicle_number: vehicleNumber,
  };

  return {
    ...slip,
    vehicleNumber,
    qrCodePayload: updatedQrPayload,
  };
}

export function getVehicleStatusBadge(vehicleNumber: string | null, slotStart: string): {
  label: string;
  isPending: boolean;
  statusColor: 'amber' | 'emerald';
} {
  if (vehicleNumber && vehicleNumber.trim().length > 0) {
    return {
      label: vehicleNumber,
      isPending: false,
      statusColor: 'emerald',
    };
  }

  return {
    label: 'Pending - Required 6h prior',
    isPending: true,
    statusColor: 'amber',
  };
}

export interface FormattedDigitalSlipView {
  slipId: string;
  farmerName: string;
  cropType: string;
  slotWindow24h: string;
  vehicleNumber: string;
  isVehiclePending: boolean;
  qrCodePayload: QRCodePayload;
}

export function formatDigitalSlipForDisplay(slip: DigitalSlip): FormattedDigitalSlipView {
  const vehicleBadge = getVehicleStatusBadge(slip.vehicleNumber, slip.slotStart);
  const start = new Date(slip.slotStart);
  const end = new Date(slip.slotEnd);
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  const slotWindow24h = `${start.toLocaleDateString('en-IN', dateOptions)} ${start.toLocaleTimeString('en-IN', timeOptions)} – ${end.toLocaleDateString('en-IN', dateOptions)} ${end.toLocaleTimeString('en-IN', timeOptions)} (24h Window)`;

  return {
    slipId: slip.slipId,
    farmerName: slip.farmerName,
    cropType: slip.cropType,
    slotWindow24h,
    vehicleNumber: vehicleBadge.label, // Exposes actual number or 'Pending - Required 6h prior'
    isVehiclePending: vehicleBadge.isPending,
    qrCodePayload: slip.qrCodePayload,
  };
}

