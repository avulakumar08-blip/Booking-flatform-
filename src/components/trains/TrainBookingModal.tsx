import React, { useState } from 'react';
import { 
  X, 
  Train as TrainIcon, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Check, 
  Clock, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { Train, TrainClassOption, TrainPassenger, ConfirmedTicket } from '../../types/booking';

interface TrainBookingModalProps {
  train: Train | null;
  selectedClass: TrainClassOption | null;
  journeyDate: string;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (ticket: ConfirmedTicket) => void;
}

export const TrainBookingModal: React.FC<TrainBookingModalProps> = ({
  train,
  selectedClass,
  journeyDate,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [passengers, setPassengers] = useState<TrainPassenger[]>([
    {
      id: 'p-1',
      name: 'Rahul Sharma',
      age: 32,
      gender: 'Male',
      berthPreference: 'Lower',
    },
  ]);

  const [irctcUser, setIrctcUser] = useState('rahul_rail88');
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [quota, setQuota] = useState('General');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  if (!isOpen || !train || !selectedClass) return null;

  const handleAddPassenger = () => {
    if (passengers.length >= 4) return;
    setPassengers([
      ...passengers,
      {
        id: `p-${passengers.length + 1}`,
        name: '',
        age: 28,
        gender: 'Female',
        berthPreference: 'Middle',
      },
    ]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((p) => p.id !== id));
  };

  const handleUpdatePassenger = (id: string, field: keyof TrainPassenger, value: any) => {
    setPassengers(
      passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const baseFare = selectedClass.price * passengers.length;
  const reservationCharges = passengers.length * 40;
  const irctcServiceFee = 35.4;
  const totalAmount = Math.round(baseFare + reservationCharges + irctcServiceFee);

  const handleConfirmBooking = () => {
    // Generate coach and berth numbers
    const coachPrefix = selectedClass.code === '1A' ? 'H1' : selectedClass.code === '2A' ? 'A1' : selectedClass.code === '3A' ? 'B2' : selectedClass.code === 'CC' ? 'C1' : 'S3';
    const startBerth = Math.floor(10 + Math.random() * 50);
    const assignedSeats = passengers.map((p, i) => `${coachPrefix}-${startBerth + i * 2}`);

    const bookingId = `TRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const pnr = `IR-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newTicket: ConfirmedTicket = {
      id: bookingId,
      pnr,
      category: 'trains',
      title: train.name,
      subtitle: `Train #${train.number} · Class: ${selectedClass.name} (${selectedClass.code})`,
      bookingTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      journeyDate: journeyDate,
      time: `${train.departureTime} Departure → ${train.arrivalTime} Arrival`,
      locationOrRoute: `${train.fromStation} (${train.fromCode}) → ${train.toStation} (${train.toCode})`,
      seatSummary: `Coach ${coachPrefix} · Berths: ${assignedSeats.join(', ')}`,
      seatNumbers: assignedSeats,
      passengerSummary: `${passengers.length} Passenger(s) · Quota: ${quota}`,
      passengers: passengers.map((p, idx) => ({
        name: p.name || `Passenger ${idx + 1}`,
        details: `Age ${p.age} · ${p.gender} · Seat: ${assignedSeats[idx]} (${p.berthPreference} Berth)`,
      })),
      baseAmount: baseFare,
      taxAndFees: Math.round(reservationCharges + irctcServiceFee),
      discount: 0,
      totalAmount,
      status: 'CONFIRMED',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pnr)}`,
      barcodeNumber: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      extraDetails: {
        'Train Number': train.number,
        'Class': selectedClass.name,
        'Quota': quota,
        'IRCTC User': irctcUser,
        'Catering': train.foodProvided ? 'Meals Included' : 'Optional at station',
      },
    };

    onClose();
    onBookingSuccess(newTicket);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-3xl my-auto overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600/10 text-rose-500">
              <TrainIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-rose-500 uppercase tracking-wider">IRCTC Rail Pass</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{train.number}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-semibold">{selectedClass.statusText}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                {train.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Train Route Mini Bar */}
        <div className="border-b border-neutral-800 bg-neutral-950/60 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-mono text-neutral-300">
            <span className="font-bold text-white">{train.fromCode}</span>
            <span>({train.departureTime})</span>
            <ArrowRight className="h-3.5 w-3.5 text-rose-500" />
            <span className="font-bold text-white">{train.toCode}</span>
            <span>({train.arrivalTime})</span>
          </div>

          <div className="flex items-center gap-3 text-neutral-400">
            <span>Date: <strong className="text-white">{journeyDate}</strong></span>
            <span>·</span>
            <span>Class: <strong className="text-rose-400">{selectedClass.code}</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Passenger Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Passenger Details ({passengers.length}/4)
                </h3>
                <p className="text-[11px] text-neutral-400">Enter names matching valid government ID proofs</p>
              </div>

              {passengers.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPassenger}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-rose-400 hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add Passenger</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {passengers.map((p, idx) => (
                <div 
                  key={p.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-300">
                      Passenger {idx + 1}
                    </span>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePassenger(p.id)}
                        className="text-neutral-500 hover:text-rose-400 transition-colors"
                        title="Remove passenger"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                      <label className="text-[11px] text-neutral-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Chandra"
                        value={p.name}
                        onChange={(e) => handleUpdatePassenger(p.id, 'name', e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-neutral-400 block mb-1">Age</label>
                      <input
                        type="number"
                        min="5"
                        max="110"
                        value={p.age}
                        onChange={(e) => handleUpdatePassenger(p.id, 'age', Number(e.target.value))}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-neutral-400 block mb-1">Gender</label>
                      <select
                        value={p.gender}
                        onChange={(e) => handleUpdatePassenger(p.id, 'gender', e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[11px] text-neutral-400 block mb-1">Berth Choice</label>
                      <select
                        value={p.berthPreference}
                        onChange={(e) => handleUpdatePassenger(p.id, 'berthPreference', e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                      >
                        <option value="Lower">Lower Berth</option>
                        <option value="Middle">Middle Berth</option>
                        <option value="Upper">Upper Berth</option>
                        <option value="Side Lower">Side Lower</option>
                        <option value="Side Upper">Side Upper</option>
                        <option value="No Preference">No Preference</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IRCTC & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs text-neutral-400 block mb-1">IRCTC User ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={irctcUser}
                  onChange={(e) => setIrctcUser(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                />
                <Check className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Mobile for SMS Updates</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-neutral-400 block mb-1">Quota</label>
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="General">General Quota</option>
                <option value="Tatkal">Tatkal (Instant)</option>
                <option value="Ladies">Ladies Quota</option>
                <option value="Senior Citizen">Senior Citizen / Lower Berth</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500/30'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <Sparkles className="h-4 w-4 text-rose-500" />
                <div>
                  <div className="text-xs font-semibold">Zero-Gateway UPI</div>
                  <div className="text-[10px] text-neutral-400">Instant approval via BHIM / UPI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500/30'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4 text-rose-500" />
                <div>
                  <div className="text-xs font-semibold">Credit / Debit Card</div>
                  <div className="text-[10px] text-neutral-400">All banks supported</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400">Total Payable:</div>
            <div className="text-lg font-bold text-white font-mono">
              ₹{totalAmount}{' '}
              <span className="text-xs text-neutral-400 font-normal">
                ({passengers.length} passenger{passengers.length > 1 ? 's' : ''})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmBooking}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-colors"
            >
              <span>Pay ₹{totalAmount} & Book</span>
              <Check className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
