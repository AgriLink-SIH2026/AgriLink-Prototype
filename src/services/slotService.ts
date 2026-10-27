import { Booking, Slot, SlotStatus, DigitalSlip } from '../types';
import { generateDigitalSlip } from './digitalSlipService';

export interface AdvanceWindowValidation {
  allowed: boolean;
  reason?: string;
  daysUntilBookingOpen?: number;
}

export interface VehicleValidationResult {
  allowed: boolean;
  reason?: string;
}

export class SlotService {
  /**
   * 1-Week (7 days) Advance Window Lock
   * Restricts slot booking inputs so farmers can only book a slot 1 week (7 days)
   * prior to their selected harvest_date.
   */
  public static validateAdvanceWindowLock(
    harvestDateStr: string,
    currentDate: Date = new Date()
  ): AdvanceWindowValidation {
    const harvestDate = new Date(harvestDateStr);
    harvestDate.setHours(0, 0, 0, 0);

    const now = new Date(currentDate);
    now.setHours(0, 0, 0, 0);

    const diffTimeMs = harvestDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTimeMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        allowed: false,
        reason: 'Harvest date cannot be in the past.',
      };
    }

    // Must be booked strictly within 7 days prior to harvest
    if (diffDays > 7) {
      return {
        allowed: false,
        reason: `Advance Window Locked: Bookings open strictly 1 week (7 days) prior to your harvest date. Please return in ${diffDays - 7} day(s).`,
        daysUntilBookingOpen: diffDays - 7,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if current time is within 6 hours of slot_start (T - 6h)
   */
  public static isWithin6HoursOfSlot(
    slotStartStr: string,
    currentDate: Date = new Date()
  ): boolean {
    const slotStart = new Date(slotStartStr).getTime();
    const now = currentDate.getTime();
    const sixHoursMs = 6 * 60 * 60 * 1000;

    // True if current time is within 6 hours before slotStart, or already past slotStart
    return now >= slotStart - sixHoursMs;
  }

  /**
   * Validate if vehicle registration can be submitted or updated
   * Allowed up until T - 6 hours before slot_start
   */
  public static canUpdateVehicle(
    slotStartStr: string,
    currentDate: Date = new Date()
  ): VehicleValidationResult {
    if (this.isWithin6HoursOfSlot(slotStartStr, currentDate)) {
      return {
        allowed: false,
        reason: 'Vehicle updates are locked: Vehicle number must be submitted at least 6 hours prior to slot start.',
      };
    }
    return { allowed: true };
  }

  /**
   * Gate entry pass verification
   * Blocks entry pass verification if vehicle_number is missing when within the 6-hour window.
   */
  public static verifyGatePassEligibility(
    booking: Booking,
    currentDate: Date = new Date()
  ): { allowed: boolean; reason?: string } {
    if (booking.slotStatus === 'CANCELLED' || booking.slotStatus === 'RELEASED') {
      return {
        allowed: false,
        reason: `Gate entry denied: Slot booking status is ${booking.slotStatus}.`,
      };
    }

    const within6Hours = this.isWithin6HoursOfSlot(booking.slotStart, currentDate);

    if (within6Hours && (!booking.vehicleNumber || booking.vehicleNumber.trim() === '')) {
      return {
        allowed: false,
        reason: 'Gate Entry Blocked: Vehicle registration number is mandatory at least 6 hours prior to slot start.',
      };
    }

    return { allowed: true };
  }

  /**
   * Dynamic Slot Release
   * 1. Mark current Booking status as 'RELEASED'
   * 2. Instantly update slot capacity to make the 24-hour window available for immediate re-booking.
   */
  public static releaseSlot(
    booking: Booking,
    slot: Slot
  ): { updatedBooking: Booking; updatedSlot: Slot } {
    if (booking.slotStatus === 'RELEASED') {
      throw new Error('Double Release Prevented: This booking slot has already been released.');
    }
    if (booking.slotStatus === 'CANCELLED') {
      throw new Error('Invalid Release: Booking is cancelled.');
    }

    const updatedBooking: Booking = {
      ...booking,
      slotStatus: 'RELEASED',
      updatedAt: new Date().toISOString(),
    };

    const restoredCapacity = Number(
      Math.min(
        slot.totalCapacityTons,
        slot.availableCapacityTons + booking.quantityTons
      ).toFixed(2)
    );

    const updatedSlot: Slot = {
      ...slot,
      availableCapacityTons: restoredCapacity,
      status: restoredCapacity > 0 ? 'AVAILABLE' : slot.status,
    };

    return { updatedBooking, updatedSlot };
  }

  /**
   * Format 24-Hour window display string
   */
  public static format24HourWindow(slotStart: string, slotEnd: string): string {
    const start = new Date(slotStart);
    const end = new Date(slotEnd);

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

    return `${start.toLocaleDateString('en-IN', dateOptions)} ${start.toLocaleTimeString('en-IN', timeOptions)} – ${end.toLocaleDateString('en-IN', dateOptions)} ${end.toLocaleTimeString('en-IN', timeOptions)} (24h Window)`;
  }
}
