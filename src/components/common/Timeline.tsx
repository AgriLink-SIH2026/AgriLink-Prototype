import React from 'react';
import { ProcurementStatus, StatusHistoryItem } from '../../types';
import { STANDARD_STAGES } from '../../config/cropWorkflows';
import { Check, Clock, Circle } from 'lucide-react';

interface TimelineProps {
  currentStatus: ProcurementStatus;
  statusHistory?: StatusHistoryItem[];
  compact?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({
  currentStatus,
  statusHistory = [],
  compact = false,
}) => {
  const stages = STANDARD_STAGES;
  const currentIdx = stages.findIndex((s) => s.id === currentStatus);

  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Step Items */}
        <div className="space-y-4 sm:space-y-6">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentIdx || currentStatus === 'Completed';
            const isCurrent = idx === currentIdx && currentStatus !== 'Completed';
            const isPending = idx > currentIdx;

            const historyItem = statusHistory.find((h) => h.status === stage.id);

            return (
              <div key={stage.id} className="relative flex items-start gap-4 group">
                {/* Connecting vertical line */}
                {idx !== stages.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 -bottom-4 w-0.5 transition-colors ${
                      isCompleted ? 'bg-[#173522]' : 'bg-[#DFD7C4]'
                    }`}
                  />
                )}

                {/* Node Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    isCompleted
                      ? 'bg-[#173522] text-[#EBE5D6] shadow-xs'
                      : isCurrent
                      ? 'bg-[#D97824] text-white ring-4 ring-[#D97824]/20 shadow-md animate-pulse'
                      : 'bg-[#FAF7F0] border-2 border-[#DFD7C4] text-[#777268]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Circle className="w-3 h-3 text-[#DFD7C4]" />
                  )}
                </div>

                {/* Stage Content */}
                <div className="flex-1 pt-0.5 pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h5
                      className={`text-sm font-serif font-bold ${
                        isCurrent
                          ? 'text-[#D97824] font-extrabold text-base'
                          : isCompleted
                          ? 'text-[#173522]'
                          : 'text-[#777268]'
                      }`}
                    >
                      {stage.label}
                    </h5>

                    {isCurrent && (
                      <span className="text-[10px] font-sans font-bold tracking-wider uppercase bg-[#FAF7F0] text-[#D97824] border border-[#D97824]/40 px-2.5 py-0.5 rounded-full animate-pulse">
                        ● Current Milestone
                      </span>
                    )}

                    {historyItem?.timestamp && (
                      <span className="text-[11px] font-sans text-[#777268] font-medium">
                        {new Date(historyItem.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  {!compact && (
                    <p
                      className={`text-xs mt-1 font-sans ${
                        isCurrent ? 'text-[#171713] font-medium' : isCompleted ? 'text-[#777268]' : 'text-[#777268]/70'
                      }`}
                    >
                      {stage.shortDescription}
                    </p>
                  )}

                  {historyItem?.notes && (
                    <div className="mt-2 p-3 bg-[#FAF7F0] border border-[#DFD7C4] rounded-2xl text-xs text-[#171713] font-sans">
                      <span className="font-semibold text-[#173522]">
                        {historyItem.updatedBy}:
                      </span>{' '}
                      {historyItem.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
