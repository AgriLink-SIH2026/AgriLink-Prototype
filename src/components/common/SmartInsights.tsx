import React from 'react';
import { SmartInsight } from '../../services/smartInsights';
import { Sparkles, TrendingUp, Calendar, AlertOctagon, Lightbulb } from 'lucide-react';

interface SmartInsightsProps {
  insights: SmartInsight[];
  title?: string;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({
  insights,
  title = 'Agronomic & Logistics Intelligence',
}) => {
  if (!insights || insights.length === 0) return null;

  const getCategoryIcon = (category: SmartInsight['category']) => {
    switch (category) {
      case 'Yield Prediction':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'Harvest Window':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'Scheduling Optimization':
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
      case 'Anomaly Detection':
        return <AlertOctagon className="w-4 h-4 text-rose-600" />;
    }
  };

  const getCardBorder = (category: SmartInsight['category']) => {
    switch (category) {
      case 'Yield Prediction':
        return 'border-emerald-200/80 bg-emerald-50/40';
      case 'Harvest Window':
        return 'border-sky-200/80 bg-sky-50/40';
      case 'Scheduling Optimization':
        return 'border-amber-200/80 bg-amber-50/40';
      case 'Anomaly Detection':
        return 'border-rose-200/80 bg-rose-50/40';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 whitespace-normal text-center">
          Rule-Based AI Engine
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 min-w-0">
        {insights.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition hover:shadow-xs flex flex-col justify-between ${getCardBorder(
              item.category
            )}`}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 min-w-0">
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                </div>
                {/* STRICT REQUIRED BADGE LABEL */}
                <span className="text-xs font-bold text-amber-700 bg-amber-100/90 border border-amber-300/80 px-2 py-1 rounded-full whitespace-normal text-center">
                  Smart Insight — Prototype
                </span>
              </div>

              <h5 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h5>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed break-words">{item.description}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <p className="text-xs text-slate-700 font-medium leading-relaxed break-words">
                <strong className="text-slate-900">Action:</strong> {item.recommendation}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Algorithmic confidence:</span>
                <span className="font-semibold text-slate-700">{item.confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${item.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
