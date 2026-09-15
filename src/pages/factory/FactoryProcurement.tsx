import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { QualityWeighmentModal } from '../../components/factory/QualityWeighmentModal';
import { BillGenerateModal } from '../../components/factory/BillGenerateModal';
import { Modal } from '../../components/common/Modal';
import { ProcurementRecord, CropRegistration } from '../../types';
import {
  Milestone,
  PlusCircle,
  Scale,
  Receipt,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';

export const FactoryProcurement: React.FC = () => {
  const { crops, procurements, scheduleProcurement, factories } = useAppData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const activeFactory =
    factories.find((f) => f.id === currentUser?.id || f.name.includes(currentUser?.name || '')) || {
      id: currentUser?.id || 'new-factory', name: currentUser?.name || 'New Processing Factory',
      district: 'Not configured', state: '', dailyCapacityTons: 0, supportedCrops: [],
      industryType: 'Grain' as const, address: '', phone: currentUser?.phone || '',
      email: currentUser?.email || '', latitude: 0, longitude: 0,
    };

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedCropToSchedule, setSelectedCropToSchedule] = useState<CropRegistration | null>(
    null
  );
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [harvestDate, setHarvestDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [batchNumber, setBatchNumber] = useState(
    `BAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');

  // Operations Modals
  const [qualityTarget, setQualityTarget] = useState<ProcurementRecord | null>(null);
  const [billingTarget, setBillingTarget] = useState<ProcurementRecord | null>(null);

  // Crops registered directly by farmers and not yet in procurement
  const existingProcurementCropIds = new Set(procurements.map((p) => p.cropRegistrationId));
  const registeredCropsAvailable = crops.filter(
    (c) => c.status === 'Registered' && !existingProcurementCropIds.has(c.id)
  );

  const handleOpenScheduleModal = (crop: CropRegistration) => {
    setSelectedCropToSchedule(crop);
    setIsScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCropToSchedule) return;

    try {
      await scheduleProcurement({
        cropRegistrationId: selectedCropToSchedule.id,
        factoryId: activeFactory.id,
        scheduledDate,
        harvestDate,
        batchNumber,
        priority,
      });

      showToast(
        `Procurement scheduled for ${selectedCropToSchedule.cropType} (${batchNumber})!`,
        'success'
      );
      setIsScheduleModalOpen(false);
      setSelectedCropToSchedule(null);
    } catch (err) {
      showToast('Failed to schedule procurement.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Milestone className="w-3.5 h-3.5 text-amber-700" />
            <span>Section 16 &amp; 18 • Central Procurement Workflow Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Procurement Lifecycle Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Transition consignments through Scheduling &rarr; Quality &rarr; Weighment &rarr; Billing &rarr; Payout.
          </p>
        </div>

        {registeredCropsAvailable.length > 0 && (
          <button
            onClick={() => handleOpenScheduleModal(registeredCropsAvailable[0])}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Intake Registered Crop ({registeredCropsAvailable.length} Available)</span>
          </button>
        )}
      </div>

      {/* Registered crops ready for scheduling */}
      {registeredCropsAvailable.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Registered Crops Awaiting Intake Slot Allocation</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
              {registeredCropsAvailable.length} Ready Lots
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {registeredCropsAvailable.map((crop) => (
              <div
                key={crop.id}
                className="bg-white p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {crop.cropType} ({crop.variety})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {crop.farmerName} • {crop.landArea} {crop.landUnit} • {crop.village}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenScheduleModal(crop)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shrink-0 transition"
                >
                  Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Procurement Lifecycle Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Consignments in Procurement Cycle</h3>

        {procurements.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No active procurements in queue</h4>
            <p className="text-xs text-slate-500 mt-1">
              Select an available registered crop above to schedule your first intake.
            </p>
          </div>
        ) : (
          procurements.map((proc) => (
            <div
              key={proc.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition"
            >
              {/* Row 1: Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                    {proc.cropType.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {proc.cropType} ({proc.variety})
                      </h4>
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Batch: {proc.batchNumber || proc.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Farmer: <strong className="text-slate-800">{proc.farmerName}</strong> (
                      {proc.farmerPhone}) • Plot ID: {proc.cropRegistrationId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={proc.currentStatus} />
                </div>
              </div>

              {/* Row 2: Key milestone pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* 1. Scheduling Pillar */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    1. Scheduling &amp; Harvest
                  </span>
                  <p className="font-medium text-slate-800">
                    Intake: {proc.scheduledDate || 'TBD'}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Harvest: {proc.harvestDate || 'TBD'}
                  </p>
                </div>

                {/* 2. Quality & Weighment Pillar */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    2. Certified Net Weight
                  </span>
                  {proc.weighment ? (
                    <div>
                      <p className="font-mono font-bold text-emerald-800 text-sm">
                        {proc.weighment.netWeightKg.toLocaleString()} kg
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Grade: {proc.quality?.grade || 'Tested'}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Pending weighbridge</span>
                  )}
                </div>

                {/* 3. Billing & Payout Pillar */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    3. Digital Bill &amp; Payout
                  </span>
                  {proc.bill ? (
                    <div>
                      <p className="font-mono font-bold text-slate-900 text-sm">
                        ₹{proc.bill.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-700">
                        {proc.bill.paymentStatus}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Pending bill issue</span>
                  )}
                </div>
              </div>

              {/* Row 3: Action Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Last Updated: {new Date(proc.updatedAt).toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQualityTarget(proc)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{proc.weighment ? 'Weighment Certified' : 'Quality & Weighbridge'}</span>
                  </button>

                  <button
                    onClick={() => setBillingTarget(proc)}
                    disabled={!proc.weighment}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      proc.weighment
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    title={
                      !proc.weighment
                        ? 'Weighment must be certified before billing can be issued.'
                        : ''
                    }
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>{proc.bill ? 'Bill Slip / Payment' : 'Issue Bill'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Procurement Intake Modal */}
      {isScheduleModalOpen && selectedCropToSchedule && (
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Schedule Factory Procurement Intake"
          subtitle={`Allocate slot for ${selectedCropToSchedule.cropType} (${selectedCropToSchedule.id})`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmSchedule} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p>
                <strong>Farmer:</strong> {selectedCropToSchedule.farmerName} (
                {selectedCropToSchedule.farmerPhone})
              </p>
              <p>
                <strong>Location:</strong> {selectedCropToSchedule.village},{' '}
                {selectedCropToSchedule.district}
              </p>
              <p>
                <strong>Crop:</strong> {selectedCropToSchedule.cropType} (
                {selectedCropToSchedule.variety}) - {selectedCropToSchedule.landArea}{' '}
                {selectedCropToSchedule.landUnit}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Batch Code / Lot Identifier
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono font-bold uppercase"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Scheduled Harvest Date
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Factory Intake Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Scheduling Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Normal">Normal Queue</option>
                <option value="High">High - Perishable lot</option>
                <option value="Urgent">Urgent - Direct Crushing</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Procurement Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Operations Modals */}
      {qualityTarget && (
        <QualityWeighmentModal
          isOpen={!!qualityTarget}
          onClose={() => setQualityTarget(null)}
          procurement={qualityTarget}
        />
      )}

      {billingTarget && (
        <BillGenerateModal
          isOpen={!!billingTarget}
          onClose={() => setBillingTarget(null)}
          procurement={billingTarget}
        />
      )}
    </div>
  );
};
