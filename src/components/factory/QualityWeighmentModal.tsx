import React, { useState, useEffect } from 'react';
import { ProcurementRecord } from '../../types';
import { Modal } from '../common/Modal';
import { CROP_WORKFLOWS } from '../../config/cropWorkflows';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { Scale, CheckCircle2, FlaskConical, Award } from 'lucide-react';

interface QualityWeighmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  procurement: ProcurementRecord;
}

export const QualityWeighmentModal: React.FC<QualityWeighmentModalProps> = ({
  isOpen,
  onClose,
  procurement,
}) => {
  const { recordQualityAndWeighment } = useAppData();
  const { showToast } = useToast();

  const workflowConfig = CROP_WORKFLOWS[procurement.cropType];

  // Quality Fields
  const [grade, setGrade] = useState<'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C (Fair)' | 'Rejected'>(
    procurement.quality?.grade || 'Grade A (Premium)'
  );
  const [moisture, setMoisture] = useState<number>(procurement.quality?.moisturePercentage || 8.0);
  const [brix, setBrix] = useState<number>(procurement.quality?.brixPercentage || 19.5);
  const [stapleLength, setStapleLength] = useState<number>(
    procurement.quality?.stapleLengthMm || 29.5
  );
  const [oilContent, setOilContent] = useState<number>(
    procurement.quality?.oilContentPercentage || 40.2
  );
  const [cuppingScore, setCuppingScore] = useState<number>(
    procurement.quality?.cuppingScore || 84.0
  );
  const [qualityRemarks, setQualityRemarks] = useState(
    procurement.quality?.remarks || 'Fair average quality tested and approved.'
  );

  // Weighment Fields
  const [grossWeight, setGrossWeight] = useState<number>(
    procurement.weighment?.grossWeightKg || 12500
  );
  const [tareWeight, setTareWeight] = useState<number>(
    procurement.weighment?.tareWeightKg || 3500
  );
  const [scaleOperator, setScaleOperator] = useState(
    procurement.weighment?.scaleOperator || 'Dharmendra Joshi (Certified Weighmaster)'
  );
  const [slipNumber, setSlipNumber] = useState(
    procurement.weighment?.slipNumber || `WB-${Math.floor(10000 + Math.random() * 90000)}`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculated Net Weight: Gross - Tare
  const netWeight = Math.max(0, grossWeight - tareWeight);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (grossWeight <= tareWeight) {
      showToast('Gross Weight must be greater than Tare Weight.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await recordQualityAndWeighment(
        procurement.id,
        {
          grade,
          moisturePercentage: moisture,
          brixPercentage: procurement.cropType === 'Sugarcane' ? brix : undefined,
          stapleLengthMm: procurement.cropType === 'Cotton' ? stapleLength : undefined,
          oilContentPercentage:
            ['Mustard', 'Soybean', 'Sunflower', 'Groundnut'].includes(procurement.cropType)
              ? oilContent
              : undefined,
          cuppingScore: ['Coffee', 'Tea'].includes(procurement.cropType) ? cuppingScore : undefined,
          remarks: qualityRemarks,
          checkedBy: 'Mill Laboratory QC Specialist',
        },
        {
          grossWeightKg: Number(grossWeight),
          tareWeightKg: Number(tareWeight),
          scaleOperator,
          slipNumber,
          remarks: `Electronic scale calibration verified. Certified Net: ${netWeight} kg.`,
        }
      );

      showToast(
        `Quality and Certified Net Weight (${netWeight} kg) recorded successfully!`,
        'success'
      );
      onClose();
    } catch (err) {
      showToast('Error recording quality and weighment.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Laboratory Quality & Certified Weighbridge"
      subtitle={`Lot ${procurement.id}: ${procurement.farmerName} - ${procurement.cropType}`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quality Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-800">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Part 1: Quality Grading ({procurement.cropType})
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Quality Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Grade A (Premium)">Grade A (Premium)</option>
                <option value="Grade B (Standard)">Grade B (Standard)</option>
                <option value="Grade C (Fair)">Grade C (Fair Average Quality)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Crop Specific Quality Parameter */}
            {procurement.cropType === 'Sugarcane' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brix Sucrose (% solids)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={brix}
                  onChange={(e) => setBrix(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  placeholder="e.g. 19.5"
                />
              </div>
            )}

            {procurement.cropType === 'Cotton' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Fiber Staple Length (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={stapleLength}
                  onChange={(e) => setStapleLength(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  placeholder="e.g. 29.5"
                />
              </div>
            )}

            {['Mustard', 'Soybean', 'Sunflower', 'Groundnut'].includes(procurement.cropType) && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Oil Content Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={oilContent}
                  onChange={(e) => setOilContent(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  placeholder="e.g. 40.5"
                />
              </div>
            )}

            {['Coffee', 'Tea'].includes(procurement.cropType) && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Cupping / Leaf Standard Score (pts)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={cuppingScore}
                  onChange={(e) => setCuppingScore(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                  placeholder="e.g. 84.0"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Moisture / Foreign Matter (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                placeholder="e.g. 8.0"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Quality Inspector Remarks
            </label>
            <input
              type="text"
              value={qualityRemarks}
              onChange={(e) => setQualityRemarks(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              placeholder="e.g. High purity lot, conforms to Bureau of Indian Standards."
            />
          </div>
        </div>

        {/* Certified Weighbridge Section */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800">
              <Scale className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Part 2: Certified Electronic Weighbridge
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Slip #{slipNumber}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Gross Weight (Loaded Vehicle in kg)
              </label>
              <input
                type="number"
                value={grossWeight}
                onChange={(e) => setGrossWeight(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tare Weight (Empty Vehicle in kg)
              </label>
              <input
                type="number"
                value={tareWeight}
                onChange={(e) => setTareWeight(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 font-semibold"
                required
              />
            </div>
          </div>

          {/* REAL AUTOMATIC CALCULATION DISPLAY */}
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                Certified Net Weight (Gross - Tare):
              </span>
              <p className="text-[11px] text-emerald-700">
                Formula: {grossWeight.toLocaleString('en-IN')} kg - {tareWeight.toLocaleString('en-IN')} kg
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl font-extrabold text-emerald-900">
                {netWeight.toLocaleString('en-IN')} kg
              </span>
              <span className="block text-xs font-medium text-emerald-700">
                ({(netWeight / 1000).toFixed(3)} Metric Tonnes)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Weighbridge Operator
              </label>
              <input
                type="text"
                value={scaleOperator}
                onChange={(e) => setScaleOperator(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Weighbridge Slip ID
              </label>
              <input
                type="text"
                value={slipNumber}
                onChange={(e) => setSlipNumber(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            {isSubmitting ? 'Saving...' : 'Certify & Accept Consignment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
