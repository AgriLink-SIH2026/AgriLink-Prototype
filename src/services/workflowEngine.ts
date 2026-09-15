import { ProcurementStatus, ProcurementRecord, CropRegistration } from '../types';
import { CROP_WORKFLOWS, STANDARD_STAGES } from '../config/cropWorkflows';

export interface TransitionValidationResult {
  allowed: boolean;
  reason?: string;
}

export class WorkflowEngine {
  /** Checks whether a crop registration can enter the procurement queue. */
  public static canEnterProcurement(crop: CropRegistration): TransitionValidationResult {
    if (crop.status !== 'Registered') {
      return {
        allowed: false,
        reason: `Crop registration ${crop.id} is currently "${crop.status}" and cannot enter procurement.`,
      };
    }
    return { allowed: true };
  }

  /**
   * Validates if a procurement record can advance to the target stage
   */
  public static canTransitionTo(
    procurement: ProcurementRecord,
    targetStatus: ProcurementStatus
  ): TransitionValidationResult {
    const config = CROP_WORKFLOWS[procurement.cropType] || { stages: STANDARD_STAGES };
    const currentIdx = config.stages.findIndex((s) => s.id === procurement.currentStatus);
    const targetIdx = config.stages.findIndex((s) => s.id === targetStatus);

    if (targetIdx === -1) {
      return { allowed: false, reason: `Unknown stage: ${targetStatus}` };
    }

    // Must advance forward in sequence (or maintain same stage)
    if (targetIdx < currentIdx) {
      return { allowed: false, reason: `Cannot revert procurement from ${procurement.currentStatus} to ${targetStatus}.` };
    }

    // Specific domain prerequisites
    if (targetStatus === 'Billing') {
      if (!procurement.weighment || procurement.weighment.netWeightKg <= 0) {
        return {
          allowed: false,
          reason: 'Cannot generate a bill without certified weighment records (Net Weight > 0).',
        };
      }
      if (!procurement.quality) {
        return {
          allowed: false,
          reason: 'Cannot bill without quality grading records.',
        };
      }
    }

    if (targetStatus === 'Payment Processed') {
      if (!procurement.bill) {
        return {
          allowed: false,
          reason: 'Cannot process payment without a generated invoice/bill.',
        };
      }
    }

    if (targetStatus === 'Completed') {
      if (!procurement.bill || procurement.bill.paymentStatus !== 'Paid') {
        return {
          allowed: false,
          reason: 'Cannot mark procurement as completed until payment has been confirmed as "Paid".',
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Calculates progressive percentage completion of procurement lifecycle
   */
  public static getProgressPercentage(status: ProcurementStatus): number {
    const stages = STANDARD_STAGES;
    const idx = stages.findIndex((s) => s.id === status);
    if (idx === -1) return 0;
    return Math.round(((idx + 1) / stages.length) * 100);
  }

  /**
   * Returns human-readable next step guidance
   */
  public static getNextStepGuidance(status: ProcurementStatus): string {
    switch (status) {
      case 'Crop Registered':
        return 'Crop registered. Compare processor bids and book an intake slot.';
      case 'Procurement Pending':
        return 'Factory reviewing procurement queue for calendar slot allocation.';
      case 'Procurement Scheduled':
        return 'Date confirmed. Labor gang assignment for harvest is next.';
      case 'Harvest Scheduled':
        return 'Harvest date confirmed. Arrive at the processor for the booked intake slot.';
      case 'Arrived at Procurement Center':
        return 'Checked in at weighbridge. Laboratory sample testing next.';
      case 'Quality Check':
        return 'Quality parameters tested. Electronic gross/tare weighment next.';
      case 'Weighment':
        return 'Net weight certified. Generating computerized procurement voucher.';
      case 'Accepted':
        return 'Voucher approved. Digital billing and bank transfer pending.';
      case 'Billing':
        return 'Digital bill generated. Awaiting direct account credit.';
      case 'Payment Processed':
        return 'Bank transfer processed. Archiving final procurement record.';
      case 'Completed':
        return 'Procurement cycle successfully completed and permanently archived.';
      default:
        return 'In progress.';
    }
  }
}
