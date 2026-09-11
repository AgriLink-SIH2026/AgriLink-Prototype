import React from 'react';
import { CropStatus, ProcurementStatus } from '../../types';

interface StatusBadgeProps {
  status: CropStatus | ProcurementStatus | 'Pending' | 'Processing' | 'Paid';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  const getStyle = (s: string) => {
    switch (s) {
      case 'Verified':
      case 'Completed':
      case 'Paid':
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Pending Verification':
      case 'Procurement Pending':
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      case 'In Transit':
      case 'Transport Assigned':
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'Quality Check':
      case 'Weighment':
      case 'Billing':
      case 'Arrived at Procurement Center':
      case 'Procurement Scheduled':
      case 'Harvest Scheduled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      case 'Re-verification Required':
        return 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20';
    }
  };

  const getDotColor = (s: string) => {
    switch (s) {
      case 'Verified':
      case 'Completed':
      case 'Paid':
      case 'Accepted':
        return 'bg-emerald-500';
      case 'Pending Verification':
      case 'Procurement Pending':
      case 'Pending':
        return 'bg-amber-500 animate-pulse';
      case 'In Transit':
      case 'Transport Assigned':
      case 'Processing':
        return 'bg-blue-500 animate-pulse';
      case 'Rejected':
        return 'bg-rose-500';
      case 'Re-verification Required':
        return 'bg-orange-500';
      default:
        return 'bg-indigo-500';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${getStyle(
        status
      )} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor(status)}`} />
      <span>{status}</span>
    </span>
  );
};
