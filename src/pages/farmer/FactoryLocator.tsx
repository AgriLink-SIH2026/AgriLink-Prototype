import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { MapView } from '../../components/common/MapView';
import { FactoryInfo, CropType } from '../../types';
import { CROP_LIST } from '../../config/crops';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Sprout,
  Navigation,
} from 'lucide-react';

export const FactoryLocator: React.FC = () => {
  const { factories } = useAppData();

  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const districts = Array.from(new Set(factories.map((f) => f.district)));

  const filteredFactories = factories.filter((factory) => {
    const matchesCrop =
      selectedCrop === 'all' || factory.supportedCrops.includes(selectedCrop as CropType);
    const matchesDistrict = districtFilter === 'all' || factory.district === districtFilter;
    const matchesSearch =
      factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factory.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      factory.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCrop && matchesDistrict && matchesSearch;
  });

  const mapMarkers = filteredFactories.map((f) => ({
    lat: f.latitude,
    lng: f.longitude,
    title: f.name,
    subtitle: `${f.district}, ${f.state} (${f.industryType})`,
    type: 'factory' as const,
  }));

  const mapCenter: [number, number] =
    filteredFactories.length > 0
      ? [filteredFactories[0].latitude, filteredFactories[0].longitude]
      : [16.7452, 74.2764];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
          <Building2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Section 25 • Factory &amp; Procurement Center Discovery</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Procurement Centers &amp; Mills Directory
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Locate processing factories and government-authorized procurement yards in your agricultural zone.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search factories by name, district, or address..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">All Crops</option>
            {CROP_LIST.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">All Districts</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span className="font-semibold flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
            <span>Regional GIS Mill Placement</span>
          </span>
          <span>Showing {filteredFactories.length} procurement centers</span>
        </div>
        <MapView center={mapCenter} zoom={7} height="280px" markers={mapMarkers} />
      </div>

      {/* Factory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFactories.map((factory) => (
          <div
            key={factory.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-300 transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {factory.industryType} Industry
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{factory.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1.5">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{factory.address}</span>
                </p>
                <p className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{factory.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{factory.email}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Supported Crops:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {factory.supportedCrops.map((crop) => (
                    <span
                      key={crop}
                      className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Daily Capacity: <strong>{factory.dailyCapacityTons} TCD</strong></span>
              <a
                href={`https://www.google.com/maps?q=${factory.latitude},${factory.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:text-amber-800 font-bold"
              >
                Directions &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
