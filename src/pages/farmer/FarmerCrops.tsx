import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { CropCard } from '../../components/farmer/CropCard';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CropRegistration } from '../../types';
import { navigate } from '../../utils/navigation';
import {
  Sprout,
  PlusCircle,
  Search,
  Filter,
  Calendar,
} from 'lucide-react';

export const FarmerCrops: React.FC = () => {
  const { currentUser } = useAuth();
  const { crops } = useAppData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<CropRegistration | null>(null);

  // Filter crops belonging to current farmer
  const myCrops = currentUser
    ? crops.filter((c) => c.farmerId === currentUser.id || c.farmerName === currentUser.name)
    : [];

  const filteredCrops = myCrops.filter((crop) => {
    const matchesSearch =
      crop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || crop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EFE4] border border-[#DFD7C4] text-[#173522] text-xs font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97824]" />
            Land Records &amp; Cultivation Plots
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#173522] tracking-tight">
            Registered Crops
          </h2>
          <p className="text-xs font-sans text-[#777268] mt-1">
            Browse your registered processing crops and open the processor marketplace when ready.
          </p>
        </div>

        <button
          onClick={() => navigate('/farmer/crops/register')}
          className="px-5 py-3 bg-[#173522] hover:bg-[#244532] text-[#F3EFE4] rounded-2xl text-xs font-bold transition shadow-sm flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#D97824]" />
          <span>Register New Crop</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD7C4] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#777268] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, crop type, variety, or village..."
            className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173522] text-[#171713]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#777268] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-[#DFD7C4] bg-[#F3EFE4]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173522] font-sans text-[#171713]"
          >
            <option value="all">All Crop Records</option>
            <option value="Registered">Registered</option>
          </select>
        </div>
      </div>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DFD7C4] p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F3EFE4] border border-[#DFD7C4] flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-7 h-7 text-[#D97824]" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#173522]">No crop records found</h3>
          <p className="text-xs text-[#777268] mt-1 max-w-sm mx-auto font-sans">
            {searchQuery || statusFilter !== 'all'
              ? 'Try changing your search term or status filter.'
              : 'You have not registered any crop plots yet.'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => navigate('/farmer/crops/register')}
              className="mt-4 px-4 py-2 bg-[#173522] text-[#F3EFE4] text-xs font-semibold rounded-xl hover:bg-[#244532] transition cursor-pointer"
            >
              Register your first crop
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              onViewDetails={() => setSelectedCrop(crop)}
              onViewProcurement={() => navigate('/farmer/procurement')}
            />
          ))}
        </div>
      )}

      {/* Detailed Crop Modal */}
      {selectedCrop && (
        <Modal
          isOpen={!!selectedCrop}
          onClose={() => setSelectedCrop(null)}
          title={`Crop Dossier: ${selectedCrop.id}`}
          subtitle={`${selectedCrop.cropType} (${selectedCrop.variety})`}
          maxWidth="xl"
        >
          <div className="space-y-5">
            {/* Status Card */}
            <div className="p-4 bg-[#F3EFE4] rounded-2xl border border-[#DFD7C4] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#777268] tracking-wider">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedCrop.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#777268] tracking-wider">Registered On</span>
                <p className="text-xs text-[#173522] font-semibold mt-0.5">
                  {new Date(selectedCrop.registrationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* Field Details */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 bg-[#F3EFE4] border border-[#DFD7C4] rounded-2xl">
                <span className="text-[10px] text-[#777268] uppercase font-semibold tracking-wider">Area</span>
                <p className="font-serif font-bold text-base text-[#173522] mt-0.5">
                  {selectedCrop.landArea} {selectedCrop.landUnit}
                </p>
              </div>
              <div className="p-3.5 bg-[#F3EFE4] border border-[#DFD7C4] rounded-2xl">
                <span className="text-[10px] text-[#777268] uppercase font-semibold tracking-wider">Location</span>
                <p className="font-bold text-[#173522] mt-0.5">
                  {selectedCrop.village}, {selectedCrop.district}
                </p>
              </div>
              <div className="p-3.5 bg-[#F3EFE4] border border-[#DFD7C4] rounded-2xl">
                <span className="text-[10px] text-[#777268] uppercase font-semibold tracking-wider">Sown Date</span>
                <p className="font-semibold text-[#171713] mt-0.5">{selectedCrop.sowingDate}</p>
              </div>
              <div className="p-3.5 bg-[#F3EFE4] border border-[#DFD7C4] rounded-2xl">
                <span className="text-[10px] text-[#777268] uppercase font-semibold tracking-wider">Exp. Harvest</span>
                <p className="font-semibold text-[#D97824] mt-0.5">{selectedCrop.expectedHarvestDate}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#DFD7C4]">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-5 py-2.5 bg-[#F3EFE4] hover:bg-[#EBE5D6] text-[#173522] border border-[#DFD7C4] rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
