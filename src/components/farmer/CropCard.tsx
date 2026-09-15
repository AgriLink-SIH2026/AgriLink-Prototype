import React from 'react';
import { CropRegistration } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Calendar, Sprout, ChevronRight } from 'lucide-react';

interface CropCardProps {
  crop: CropRegistration;
  onViewDetails?: () => void;
  onViewProcurement?: () => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  onViewDetails,
  onViewProcurement,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#DFD7C4] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Image & Status Badge */}
        <div className="relative h-44 w-full bg-[#F3EFE4] overflow-hidden">
          {crop.imageUrl ? <img src={crop.imageUrl} alt={`${crop.cropType} - ${crop.variety}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="h-full flex items-center justify-center text-[#173522]"><Sprout className="w-12 h-12 opacity-30" /></div>}
          <div className="absolute top-3 left-3">
            <span className="font-mono text-[11px] font-bold bg-[#173522]/85 text-[#F3EFE4] px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-xs border border-white/10">
              {crop.id}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <StatusBadge status={crop.status} />
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-[#12281A]/85 backdrop-blur-xs text-[#F3EFE4] px-2.5 py-1.5 rounded-xl text-[11px] border border-white/10">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D97824]" />
              <span className="font-sans">{crop.village}, {crop.district}</span>
            </span>
            <span className="font-mono text-[#D97824] text-[10px]">Registration complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#D97824] shrink-0" />
              <h4 className="text-lg font-serif font-bold text-[#173522] leading-tight">
                {crop.cropType}
              </h4>
              <span className="text-xs text-[#777268] font-sans font-medium">({crop.variety})</span>
            </div>
            <p className="text-xs font-sans text-[#777268] mt-1">
              Cultivated Area: <strong className="text-[#173522]">{crop.landArea} {crop.landUnit}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-[#777268] pt-3 border-t border-[#DFD7C4]">
            <div>
              <span className="text-[10px] uppercase font-sans font-semibold text-[#777268] block tracking-wider">Sown On</span>
              <span className="font-medium text-[#171713] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-[#777268]" />
                {crop.sowingDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans font-semibold text-[#777268] block tracking-wider">Harvest Date</span>
              <span className="font-medium text-[#173522] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-[#D97824]" />
                {crop.expectedHarvestDate}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0 border-t border-[#DFD7C4]/60 mt-2 flex items-center justify-between gap-2 font-sans">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-xs font-semibold text-[#171713] hover:text-[#173522] py-2 px-3 rounded-xl hover:bg-[#F3EFE4] transition cursor-pointer"
          >
            View Details
          </button>
        )}

        {onViewProcurement && (
          <button
            onClick={onViewProcurement}
            className="text-xs font-semibold text-[#173522] hover:text-[#D97824] py-2 px-3 rounded-xl hover:bg-[#F3EFE4] transition flex items-center gap-1 ml-auto cursor-pointer"
          >
            <span>Procurement Status</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D97824]" />
          </button>
        )}
      </div>
    </div>
  );
};
