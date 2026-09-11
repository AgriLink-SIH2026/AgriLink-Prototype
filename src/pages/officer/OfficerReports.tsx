import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { InspectionReport } from '../../types';
import {
  FileText,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Award,
  AlertTriangle,
  User,
  ShieldCheck,
} from 'lucide-react';

export const OfficerReports: React.FC = () => {
  const { inspections, crops } = useAppData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState(crops[0]?.id || '');
  const [cropCondition, setCropCondition] = useState<'Excellent' | 'Good' | 'Average' | 'Poor'>('Good');
  const [fieldCondition, setFieldCondition] = useState(
    'Deep fertile black cotton soil with functional drip lines. No salinity or compaction.'
  );
  const [pestRisk, setPestRisk] = useState<'Low' | 'Moderate' | 'High'>('Low');
  const [soilMoisture, setSoilMoisture] = useState<'Adequate' | 'Deficit' | 'Excess'>('Adequate');
  const [estimatedYield, setEstimatedYield] = useState<number>(32000);
  const [remarks, setRemarks] = useState(
    'Plot verified on-site. Vegetative growth is robust, internodes uniform, expected early harvest.'
  );

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Inspection report generated and filed successfully!', 'success');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>Section 13 • Agronomic Quality Audits</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Field Inspection Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Certified field inspection observations and estimated biomass yields filed by Agronomists and Extension Officers.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Inspection Report</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {inspections.map((report) => (
          <div
            key={report.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Report ID: {report.id} • Plot: {report.cropRegistrationId}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Filed by {report.officerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Condition: {report.cropCondition}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {new Date(report.inspectionDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Soil Moisture &amp; Drainage
                </span>
                <p className="font-semibold text-slate-800">{report.soilMoistureCondition}</p>
                <p className="text-[11px] text-slate-500 mt-1">{report.fieldCondition}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Pest &amp; Infestation Risk
                </span>
                <span
                  className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                    report.pestInfestationRisk === 'Low'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {report.pestInfestationRisk} Risk
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                  Estimated Yield
                </span>
                <p className="font-mono text-base font-extrabold text-emerald-900">
                  {((report.estimatedYieldPerAcreKg || report.estimatedYieldPerAcre || 0) / 1000).toFixed(1)} MT / Acre
                </p>
                <span className="text-[10px] text-emerald-700">
                  Total Biomass: {(report.estimatedYieldPerAcreKg || report.estimatedYieldPerAcre || 0).toLocaleString()} kg/acre
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-0.5">Verification Remarks:</span>
              <p className="leading-relaxed">&ldquo;{report.verificationRemarks}&rdquo;</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Inspection Report Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Field Inspection Report"
          subtitle="Record on-site agronomic observations and estimated yield"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateReport} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Registered Crop Plot
              </label>
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.cropType} ({c.farmerName}, {c.village})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Crop Canopy Condition
                </label>
                <select
                  value={cropCondition}
                  onChange={(e) => setCropCondition(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Excellent">Excellent - High vigor</option>
                  <option value="Good">Good - Fair average</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor - Stunted</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pest Infestation Risk
                </label>
                <select
                  value={pestRisk}
                  onChange={(e) => setPestRisk(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Low">Low - Negligible</option>
                  <option value="Moderate">Moderate - Monitor</option>
                  <option value="High">High - Intervention required</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Estimated Yield (kg per acre)
              </label>
              <input
                type="number"
                value={estimatedYield}
                onChange={(e) => setEstimatedYield(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Soil Moisture &amp; Field Condition
              </label>
              <textarea
                rows={2}
                value={fieldCondition}
                onChange={(e) => setFieldCondition(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Verification Remarks &amp; Certification Sign-Off
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save &amp; Certify Report
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
