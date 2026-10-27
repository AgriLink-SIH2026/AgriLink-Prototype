import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { CropType, FactoryPriceComparison } from '../../types';
import {
  TrendingUp,
  Building2,
  MapPin,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Filter,
} from 'lucide-react';

interface PriceComparisonDashboardProps {
  onBookSlotClick?: (slotId: string, cropType: CropType) => void;
}

export const PriceComparisonDashboard: React.FC<PriceComparisonDashboardProps> = ({
  onBookSlotClick,
}) => {
  const { priceComparisons } = useAppData();
  const [selectedCrop, setSelectedCrop] = useState<string>('All');

  const filteredPrices = priceComparisons.filter(
    (p) => selectedCrop === 'All' || p.cropType === selectedCrop
  );

  const availableCrops = ['All', 'Sugarcane', 'Soybean', 'Cotton', 'Wheat'];

  // Best rate highlight
  const highestRatePerKg = Math.max(...filteredPrices.map((p) => p.buyingRatePerKg), 0);

  return (
    <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-3xl border border-[#DFD7C4] shadow-xs space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DFD7C4]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBE5D6] text-[#173522] text-[11px] font-bold mb-1 border border-[#DFD7C4]">
            <TrendingUp className="w-3.5 h-3.5 text-[#D97824]" />
            <span>Mandi &amp; Factory Live Spot Index</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171713]">
            Nearby Procurement Centre Prices
          </h3>
          <p className="text-xs text-[#777268] mt-0.5">
            Transparent crop buying rates across nearby industrial procurement &amp; crushing centers.
          </p>
        </div>

        {/* Crop Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#EBE5D6] p-1.5 rounded-2xl border border-[#DFD7C4]">
          {availableCrops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCrop === crop
                  ? 'bg-[#173522] text-[#EBE5D6] shadow-xs'
                  : 'text-[#777268] hover:text-[#171713] hover:bg-[#FAF7F0]'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrices.map((item) => {
          const isTopRate = item.buyingRatePerKg === highestRatePerKg;
          return (
            <div
              key={item.factoryId}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 bg-white ${
                isTopRate
                  ? 'border-[#D97824] shadow-md ring-1 ring-[#D97824]/30'
                  : 'border-[#DFD7C4] hover:border-[#173522]'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FAF7F0] text-[#173522] border border-[#DFD7C4]">
                    {item.cropType}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isTopRate && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D97824] text-white">
                        Best Rate
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-[#777268] flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-[#D97824]" />
                      {item.distanceKm} km
                    </span>
                  </div>
                </div>

                {/* Factory Name & Location */}
                <h4 className="font-serif font-bold text-sm text-[#171713] leading-snug line-clamp-2">
                  {item.factoryName}
                </h4>
                <p className="text-xs text-[#777268] mt-0.5">
                  {item.district}, {item.state}
                </p>

                {/* Rate Display */}
                <div className="mt-4 p-3 rounded-xl bg-[#FAF7F0] border border-[#DFD7C4] flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#777268] block">
                      Buying Rate / Quintal
                    </span>
                    <span className="font-serif text-2xl font-black text-[#173522]">
                      ₹{item.buyingRatePerQuintal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#777268] block">
                      Per Kilogram
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D97824]">
                      ₹{item.buyingRatePerKg.toFixed(2)} / kg
                    </span>
                  </div>
                </div>

                {/* Logistics & Intake specs */}
                <div className="mt-3 space-y-1.5 text-xs text-[#777268]">
                  <div className="flex items-center justify-between">
                    <span>Daily Intake Capacity:</span>
                    <strong className="text-[#171713]">{item.dailyIntakeCapacityTons} Tons/day</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Next 24h Intake Slot:</span>
                    <strong className="text-emerald-700">
                      {new Date(item.nextAvailableSlotStart).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })} (06:00 AM)
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#DFD7C4]/60">
                    <span className="text-[#777268]">Last Updated:</span>
                    <span className="font-semibold text-[#173522]">{item.lastUpdated || 'Just now'}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#DFD7C4] flex items-center justify-between gap-2">
                <a
                  href={`tel:${item.contactPhone}`}
                  className="p-2 rounded-xl text-[#777268] hover:text-[#173522] hover:bg-[#FAF7F0] transition"
                  title="Contact factory procurement desk"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onBookSlotClick?.(item.slotId, item.cropType)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <span>Book 24h Slot</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D97824]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
