import React, { useState } from 'react';
import { ProcurementRecord, TransportRecord } from '../../types';
import { Modal } from '../common/Modal';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { Truck, MapPin, Phone, User, Calendar, CheckCircle2 } from 'lucide-react';

interface TransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  procurement: ProcurementRecord;
}

export const TransportModal: React.FC<TransportModalProps> = ({
  isOpen,
  onClose,
  procurement,
}) => {
  const { assignTransport, updateTransportStatus } = useAppData();
  const { showToast } = useToast();

  const currentTransport = procurement.transport;

  const [vehicleNumber, setVehicleNumber] = useState(
    currentTransport?.vehicleNumber || 'MH-09-CV-4421'
  );
  const [driverName, setDriverName] = useState(currentTransport?.driverName || 'Suresh Patil');
  const [driverPhone, setDriverPhone] = useState(
    currentTransport?.driverPhone || '+91 97654 32190'
  );
  const [pickupDate, setPickupDate] = useState(
    currentTransport?.pickupDate || new Date().toISOString().split('T')[0]
  );
  const [pickupLocation, setPickupLocation] = useState(
    currentTransport?.pickupLocation || `${procurement.farmerName}'s Farm Gate`
  );
  const [destination, setDestination] = useState(
    currentTransport?.destination || `${procurement.factoryName} Intake Gate`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await assignTransport(procurement.id, {
        vehicleNumber,
        driverName,
        driverPhone,
        pickupDate,
        pickupLocation,
        destination,
        status: 'Assigned',
      });
      showToast(`Transport vehicle ${vehicleNumber} assigned to driver ${driverName}.`, 'success');
      onClose();
    } catch (err) {
      showToast('Error assigning transport.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvanceStatus = async (newStatus: TransportRecord['status']) => {
    setIsSubmitting(true);
    try {
      await updateTransportStatus(procurement.id, newStatus);
      showToast(`Logistics status updated to "${newStatus}".`, 'success');
      onClose();
    } catch (err) {
      showToast('Error updating transport status.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transport Logistics & Vehicle Assignment"
      subtitle={`Lot: ${procurement.id} (${procurement.cropType})`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Status Lifecycle Pills */}
        {currentTransport && (
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
              Current Transit Progression:
            </span>
            <div className="flex flex-wrap gap-2">
              {(['Assigned', 'In Transit', 'Arrived', 'Completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleAdvanceStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    currentTransport.status === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{st}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Vehicle Registration #
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. MH-09-CV-4421"
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Scheduled Pickup Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Driver Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Driver Full Name"
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Driver Mobile Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Farm Pickup Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Destination Facility</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              {isSubmitting ? 'Saving...' : 'Save & Dispatch Transport'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
