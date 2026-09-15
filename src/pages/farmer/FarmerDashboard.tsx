import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SmartInsights } from '../../components/common/SmartInsights';
import { SmartInsightsService } from '../../services/smartInsights';
import { Timeline } from '../../components/common/Timeline';
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
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const { crops, procurements } = useAppData();

  // Filter crops belonging to this farmer
  const myCrops = currentUser
    ? crops.filter((c) => c.farmerId === currentUser.id || c.farmerName === currentUser.name)
    : [];
  const dashboardCrops = myCrops
    .filter((crop, index, all) => all.findIndex((item) => item.cropType === crop.cropType) === index)
    .slice(0, 4);

  // Filter procurements belonging to this farmer
  const myProcurements = currentUser
    ? procurements.filter((p) => p.farmerId === currentUser.id || p.farmerName === currentUser.name)
    : [];

  // KPI Metrics
  const registeredCount = myCrops.length;
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

  return (
    <div className="space-y-7 font-sans text-[#171713]">
      {/* Top Header matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DFD7C4]/60">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#171713] tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-xs text-[#777268] mt-0.5">
            Overview • Foundation build
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

      {/* Welcome Hero Area matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171713] tracking-tight">
            Welcome to AgriLink
          </h2>
          <p className="text-sm text-[#777268] mt-1.5">
            Your farmer workspace is ready. Register your first crop to begin.
          </p>
        </div>

        <a
          href="/farmer/crops/register"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#D97824]" />
          <span>Register New Crop</span>
        </a>
      </div>

      {/* 4 Stats Cards matching Screenshot 1 */}
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
              {registeredCount === 0 ? 'No crops registered yet' : `${registeredCount} field plot(s) recorded`}
            </p>
          </div>
        </div>

        {/* Card 2: Marketplace-ready crops */}
        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#777268]">
              READY TO COMPARE
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
              {registeredCount === 0 ? 'Register a crop to begin' : `${registeredCount} crop lot(s) marketplace-ready`}
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
              {activeProcurementCount === 0 ? 'Nothing in progress' : `${activeProcurementCount} intake lot(s) active`}
            </p>
          </div>
        </div>

        {/* Card 4: Completed procurements */}
        <div className="bg-[#EBE5D6] p-5 rounded-3xl border border-[#DFD7C4] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#777268]">
              COMPLETED
            </span>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#777268] border border-[#DFD7C4]">
              {completedProcurementCount > 0 ? 'SETTLED' : 'IDLE'}
            </span>
          </div>
          <div>
            <p className="font-serif text-4xl font-black text-[#171713] mb-1">
              {completedProcurementCount}
            </p>
            <p className="text-xs text-[#777268]">
              {completedProcurementCount === 0 ? 'No settled lots yet' : `${completedProcurementCount} lot(s) paid and archived`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Procurement Showcase or Empty State matching Screenshot 1 */}
      {myProcurements.length === 0 ? (
        <div className="bg-[#EBE5D6] rounded-3xl border border-[#DFD7C4] p-10 sm:p-14 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F0] border border-[#DFD7C4] text-[#777268] font-mono font-bold text-sm flex items-center justify-center mx-auto mb-4">
            00
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171713] mb-2">
            No procurement activity yet
          </h3>
          <p className="text-xs sm:text-sm text-[#777268] max-w-md mx-auto leading-relaxed mb-6">
            Register a crop, compare processor bids, and book an intake slot. Scheduling,
            weighment, billing, and payment progress will appear here.
          </p>
          <a
            href="/farmer/crops/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] rounded-xl text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[#D97824]" />
            <span>Register a Crop</span>
          </a>
        </div>
      ) : (
        /* Connected Live Procurement Card */
        <div className="bg-[#FAF7F0] rounded-3xl border border-[#DFD7C4] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DFD7C4]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97824]">
                  ACTIVE PROCUREMENT
                </span>
                <span className="text-[10px] font-mono text-[#777268]">
                  {firstProcurement.batchNumber || firstProcurement.id}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#171713]">
                {firstProcurement.cropType} Procurement
              </h3>
              <p className="text-xs text-[#777268] mt-0.5">
                Processing Factory: <strong>{firstProcurement.factoryName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={firstProcurement.currentStatus} size="md" />
              <a
                href="/farmer/procurement"
                className="px-4 py-2 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Full Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Metrics of Active Procurement */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-[#EBE5D6] rounded-2xl border border-[#DFD7C4]">
              <span className="text-[10px] uppercase font-bold text-[#777268] block mb-1">
                Scheduled Intake Date
              </span>
              <p className="font-serif text-base font-bold text-[#171713]">
                {firstProcurement.scheduledDate}
              </p>
            </div>

            <div className="p-3.5 bg-[#EBE5D6] rounded-2xl border border-[#DFD7C4]">
              <span className="text-[10px] uppercase font-bold text-[#777268] block mb-1">
                Cultivated Area
              </span>
              <p className="font-serif text-base font-bold text-[#171713]">
                {firstProcurement.landArea} {firstProcurement.landUnit}
              </p>
            </div>

            <div className="p-3.5 bg-[#EBE5D6] rounded-2xl border border-[#DFD7C4]">
              <span className="text-[10px] uppercase font-bold text-[#777268] block mb-1">
                Current Stage
              </span>
              <p className="font-semibold text-[#171713] truncate">
                {firstProcurement.currentStatus}
              </p>
            </div>
          </div>

          {/* Connected Visual Timeline Preview */}
          <div className="pt-2">
            <Timeline
              currentStatus={firstProcurement.currentStatus}
              statusHistory={firstProcurement.statusHistory}
              compact
            />
          </div>
        </div>
      )}

      {/* Two Columns: Registered Crops List & Smart Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)] gap-6">
        {/* Left 2 Cols: Registered Crops */}
        <div className="space-y-4 min-w-0">
          <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-[#DFD7C4] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#171713]">
                  My Registered Crops
                </h3>
                <p className="text-xs text-[#777268]">
                  Crop lots ready for processor comparison
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
                  Register crop and harvest details without uploading a field photo.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#DFD7C4]">
                {dashboardCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#EBE5D6] shrink-0 border border-[#DFD7C4] flex flex-col items-center justify-center text-[#173522]">
                        <Sprout className="w-5 h-5" />
                        <span className="text-[9px] font-bold mt-0.5">{crop.cropType.slice(0, 3).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <h4 className="font-serif text-sm font-bold text-[#171713]">
                            {crop.cropType}
                          </h4>
                          <span className="text-xs text-[#777268]">({crop.variety})</span>
                          <span className="text-[10px] font-mono text-[#777268]/70">{crop.id}</span>
                        </div>
                        <p className="text-xs text-[#777268] mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span>{crop.landArea} {crop.landUnit}</span>
                          <span>•</span>
                          <span>Sown: {crop.sowingDate}</span>
                          <span>•</span>
                          <span>{crop.village}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <StatusBadge status={crop.status} size="sm" />
                      <a href="/farmer/marketplace" className="px-3 py-1.5 bg-[#EBE5D6] hover:bg-[#173522] hover:text-white text-[#173522] rounded-xl text-xs font-semibold transition">Compare processors &rarr;</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Insights / Passbook */}
        <div className="space-y-6 min-w-0">
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
    </div>
  );
};
