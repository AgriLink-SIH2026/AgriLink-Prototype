import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SmartInsights } from '../../components/common/SmartInsights';
import { SmartInsightsService } from '../../services/smartInsights';
import { Timeline } from '../../components/common/Timeline';
import { SlotService } from '../../services/slotService';
import { getVehicleStatusBadge } from '../../services/digitalSlipService';
import { DigitalSlipModal } from '../../components/farmer/DigitalSlipModal';
import { VehicleUpdateModal } from '../../components/farmer/VehicleUpdateModal';
import { SlotBookingModal } from '../../components/farmer/SlotBookingModal';
import { PriceComparisonDashboard } from '../../components/farmer/PriceComparisonDashboard';
import { MultilingualChatbot } from '../../components/farmer/MultilingualChatbot';
import { IvrVoiceWidget } from '../../components/farmer/IvrVoiceWidget';
import { Booking, DigitalSlip, CropType } from '../../types';
import {
  Sprout,
  CheckCircle2,
  Clock,
  Truck,
  CheckCheck,
  ArrowRight,
  AlertCircle,
  PlusCircle,
  Building2,
  ChevronRight,
  TrendingUp,
  MapPin,
  Calendar,
  QrCode,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const {
    crops,
    procurements,
    bookings,
    slots,
    digitalSlips,
    releaseSlot,
    updateBookingVehicle,
    getDigitalSlipForBooking,
  } = useAppData();

  // Modal states
  const [selectedSlip, setSelectedSlip] = useState<DigitalSlip | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  const [selectedVehicleBooking, setSelectedVehicleBooking] = useState<Booking | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const [isSlotBookingModalOpen, setIsSlotBookingModalOpen] = useState(false);
  const [preselectedSlotId, setPreselectedSlotId] = useState<string | undefined>(undefined);

  // Filter crops belonging to this farmer
  const myCrops = currentUser
    ? crops.filter((c) => c.farmerId === currentUser.id || c.farmerName === currentUser.name)
    : [];

  // Filter procurements belonging to this farmer
  const myProcurements = currentUser
    ? procurements.filter((p) => p.farmerId === currentUser.id || p.farmerName === currentUser.name)
    : [];

  // Filter bookings belonging to this farmer
  const myBookings = currentUser
    ? bookings.filter((b) => b.farmerId === currentUser.id || b.farmerName === currentUser.name)
    : [];

  const activeBookings = myBookings.filter((b) => b.slotStatus === 'BOOKED');
  const firstBooking = activeBookings[0];

  // KPI Metrics
  const registeredCount = myCrops.length;
  const activeSlotCount = activeBookings.length;
  const activeProcurementCount = myProcurements.filter(
    (p) => p.currentStatus !== 'Completed'
  ).length;
  const completedProcurementCount = myProcurements.filter(
    (p) => p.currentStatus === 'Completed'
  ).length;

  const firstProcurement = myProcurements[0];

  // Generate prototype smart insights from farmer's first active crop
  const sampleCropForInsights = myCrops[0];
  const prototypeInsights = sampleCropForInsights
    ? SmartInsightsService.generateInsightsForCrop(sampleCropForInsights)
    : [];

  const completionPercentage = farmerProfile?.completionPercentage ?? 85;

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'TG';

  const handleOpenSlipModal = (booking: Booking) => {
    const slip = getDigitalSlipForBooking(booking.id) || digitalSlips.find(s => s.bookingId === booking.id);
    if (slip) {
      setSelectedSlip(slip);
      setIsSlipModalOpen(true);
    }
  };

  const handleOpenVehicleModal = (booking: Booking) => {
    setSelectedVehicleBooking(booking);
    setIsVehicleModalOpen(true);
  };

  const handleReleaseSlot = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to release this 24-hour intake slot? It will be instantly made available to queuing farmers.')) {
      await releaseSlot(bookingId);
    }
  };

  const handleBookFromPriceComparison = (slotId: string, cropType: CropType) => {
    setPreselectedSlotId(slotId);
    setIsSlotBookingModalOpen(true);
  };

  return (
    <div className="space-y-7 font-sans text-[#171713]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DFD7C4]/60">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#171713] tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-xs text-[#777268] mt-0.5">
            Overview • 24-Hour Dynamic Slots &amp; Factory Procurement
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBE5D6] text-[#777268] border border-[#DFD7C4] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{myCrops.length > 0 ? 'Live Data Loaded' : 'No data loaded'}</span>
          </span>

          <div className="w-9 h-9 rounded-full bg-[#173522] text-[#EBE5D6] font-bold text-xs flex items-center justify-center border border-[#244532] shadow-2xs">
            {initials}
          </div>
        </div>
      </div>

      {/* Welcome Hero Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171713] tracking-tight">
            Welcome to AgriLink
          </h2>
          <p className="text-sm text-[#777268] mt-1.5">
            Book 24-hour factory intake slots, obtain digital gate passes, and compare mandi buying rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setPreselectedSlotId(undefined);
              setIsSlotBookingModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#D97824] hover:bg-[#c3681b] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Book 24h Slot</span>
          </button>

          <a
            href="/farmer/crops/register"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] rounded-xl text-xs font-bold transition shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-[#D97824]" />
            <span>Register New Crop</span>
          </a>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Crops */}
        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#777268]">
              REGISTERED CROPS
            </span>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#777268] border border-[#DFD7C4]">
              {registeredCount > 0 ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
          <div>
            <p className="font-serif text-4xl font-black text-[#171713] mb-1">
              {registeredCount}
            </p>
            <p className="text-xs text-[#777268]">
              {registeredCount === 0 ? 'No crops recorded yet' : `${registeredCount} field plot(s) registered`}
            </p>
          </div>
        </div>

        {/* Card 2: Active 24h Slots */}
        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#777268]">
              24H INTAKE SLOTS
            </span>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-emerald-800 border border-emerald-300">
              {activeSlotCount > 0 ? 'CONFIRMED' : 'OPEN'}
            </span>
          </div>
          <div>
            <p className="font-serif text-4xl font-black text-[#171713] mb-1">
              {activeSlotCount}
            </p>
            <p className="text-xs text-[#777268]">
              {activeSlotCount === 0 ? 'No active slots booked' : `${activeSlotCount} intake window(s) reserved`}
            </p>
          </div>
        </div>

        {/* Card 3: Active Procurement */}
        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#777268]">
              ACTIVE PROCUREMENT
            </span>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#777268] border border-[#DFD7C4]">
              {activeProcurementCount > 0 ? 'ACTIVE' : 'IDLE'}
            </span>
          </div>
          <div>
            <p className="font-serif text-4xl font-black text-[#171713] mb-1">
              {activeProcurementCount}
            </p>
            <p className="text-xs text-[#777268]">
              {activeProcurementCount === 0 ? 'Nothing in progress' : `${activeProcurementCount} lot(s) moving through intake`}
            </p>
          </div>
        </div>

        {/* Card 4: Digital Slips Generated */}
        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#777268]">
              DIGITAL GATE PASSES
            </span>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#777268] border border-[#DFD7C4]">
              QR READY
            </span>
          </div>
          <div>
            <p className="font-serif text-4xl font-black text-[#171713] mb-1">
              {digitalSlips.filter((s) => s.farmerId === currentUser?.id).length || activeBookings.length}
            </p>
            <p className="text-xs text-[#777268]">
              Certified online slips for factory entry
            </p>
          </div>
        </div>
      </div>

      {/* Active 24-Hour Slot Bookings Card with Vehicle Action & Digital Slip */}
      {firstBooking && (
        <div className="bg-[#FAF7F0] rounded-3xl border border-[#DFD7C4] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DFD7C4]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97824]">
                  ACTIVE 24-HOUR INTAKE BOOKING
                </span>
                <span className="text-[10px] font-mono text-[#777268]">
                  #{firstBooking.id}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#171713]">
                {firstBooking.cropType} Intake Window
              </h3>
              <p className="text-xs text-[#777268] mt-0.5">
                Harvest Date: <strong>{firstBooking.harvestDate}</strong> • Allocated Quantity:{' '}
                <strong className="text-[#171713]">{firstBooking.quantityTons} Tons</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Vehicle Update Action Button */}
              <button
                onClick={() => handleOpenVehicleModal(firstBooking)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#EBE5D6] text-[#173522] border border-[#DFD7C4] rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-[#D97824]" />
                <span>Vehicle Update</span>
              </button>

              {/* View Online Digital Slip Button */}
              <button
                onClick={() => handleOpenSlipModal(firstBooking)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#D97824]" />
                <span>View Digital Slip</span>
              </button>

              {/* Dynamic Release Slot Button */}
              <button
                onClick={() => handleReleaseSlot(firstBooking.id)}
                className="inline-flex items-center gap-1 px-3 py-2 text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold border border-red-200 transition cursor-pointer"
                title="Release this slot so other farmers can take it"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Release Slot</span>
              </button>
            </div>
          </div>

          {/* 24-Hour Window and Vehicle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* 24h Window banner */}
            <div className="p-4 bg-[#EBE5D6] rounded-2xl border border-[#DFD7C4] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#777268] block">
                24-Hour Time Window
              </span>
              <p className="font-serif text-sm font-bold text-[#171713]">
                {SlotService.format24HourWindow(firstBooking.slotStart, firstBooking.slotEnd)}
              </p>
            </div>

            {/* Vehicle Plate / Warning Banner */}
            <div className="p-4 bg-[#EBE5D6] rounded-2xl border border-[#DFD7C4] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#777268] block">
                Transport Vehicle Plate
              </span>
              {firstBooking.vehicleNumber ? (
                <p className="font-mono text-base font-extrabold text-[#173522]">
                  {firstBooking.vehicleNumber}
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Pending - Required 6h prior</span>
                </div>
              )}
            </div>

            {/* Gate Pass Quick Link */}
            <div className="p-4 bg-[#EBE5D6] rounded-2xl border border-[#DFD7C4] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#777268] block">
                Digital Pass Status
              </span>
              <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>QR Gate Pass Generated</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Price Comparison Dashboard */}
      <PriceComparisonDashboard onBookSlotClick={handleBookFromPriceComparison} />

      {/* Two Columns: Registered Crops List & IVR/Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Crops */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-[#DFD7C4] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#171713]">
                  My Registered Crops
                </h3>
                <p className="text-xs text-[#777268]">
                  Crop plots eligible for 24-hour factory slot booking
                </p>
              </div>
              <a
                href="/farmer/crops"
                className="text-xs font-bold text-[#173522] hover:text-[#D97824] flex items-center gap-1 transition"
              >
                <span>View all ({myCrops.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {myCrops.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[#DFD7C4] rounded-2xl p-6">
                <Sprout className="w-8 h-8 text-[#777268]/40 mx-auto mb-2" />
                <p className="text-xs text-[#171713] font-bold">No registered crops yet</p>
                <p className="text-xs text-[#777268] mt-0.5">
                  Register your cash crops or grains to unlock 24-hour factory intake slots.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#DFD7C4]">
                {myCrops.slice(0, 3).map((crop) => (
                  <div
                    key={crop.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-[#EBE5D6] overflow-hidden shrink-0 border border-[#DFD7C4]">
                        <img
                          src={crop.imageUrl || 'https://images.unsplash.com/photo-1594488518001-3e479a8e97f0?w=800&auto=format&fit=crop&q=80'}
                          alt={crop.cropType}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm font-bold text-[#171713]">
                            {crop.cropType}
                          </h4>
                          <span className="text-xs text-[#777268]">({crop.variety})</span>
                          <span className="text-[10px] font-mono text-[#777268]/70">{crop.id}</span>
                        </div>
                        <p className="text-xs text-[#777268] mt-0.5 flex items-center gap-2">
                          <span>{crop.landArea} {crop.landUnit}</span>
                          <span>•</span>
                          <span>Sown: {crop.sowingDate}</span>
                          <span>•</span>
                          <span>{crop.village}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setPreselectedSlotId(undefined);
                          setIsSlotBookingModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        Book 24h Slot &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: IVR Voice Access & Insights */}
        <div className="space-y-6">
          <IvrVoiceWidget />

          <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-[#DFD7C4] shadow-2xs">
            <h3 className="font-serif text-base font-bold text-[#171713] mb-1">
              Farmer Profile Status
            </h3>
            <p className="text-xs text-[#777268] mb-3">
              Passbook &amp; KYC Verification
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#171713]">
                <span>Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-[#EBE5D6] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D97824] h-full rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <a
                href="/farmer/profile"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#173522] hover:text-[#D97824] mt-2 transition"
              >
                <span>Edit Profile &amp; Bank Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <SmartInsights insights={prototypeInsights} />
        </div>
      </div>

      {/* Floating Multilingual Chatbot FAB & Drawer */}
      <MultilingualChatbot />

      {/* Digital Slip Modal */}
      <DigitalSlipModal
        slip={selectedSlip}
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        onUpdateVehicleClick={() => {
          setIsSlipModalOpen(false);
          if (firstBooking) handleOpenVehicleModal(firstBooking);
        }}
      />

      {/* Vehicle Update Modal */}
      <VehicleUpdateModal
        booking={selectedVehicleBooking}
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={updateBookingVehicle}
      />

      {/* 24-Hour Slot Booking Modal */}
      <SlotBookingModal
        isOpen={isSlotBookingModalOpen}
        onClose={() => setIsSlotBookingModalOpen(false)}
        preselectedSlotId={preselectedSlotId}
      />
    </div>
  );
};
