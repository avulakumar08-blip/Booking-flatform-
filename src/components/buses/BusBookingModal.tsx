import React, { useState } from 'react';
import { 
  X, 
  Bus as BusIcon, 
  MapPin, 
  Clock, 
  User, 
  CreditCard, 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { Bus, BusSeat, BusBoardingPoint, ConfirmedTicket } from '../../types/booking';
import { BusSeatMap } from './BusSeatMap';

interface BusBookingModalProps {
  bus: Bus | null;
  journeyDate: string;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (ticket: ConfirmedTicket) => void;
}

export const BusBookingModal: React.FC<BusBookingModalProps> = ({
  bus,
  journeyDate,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Seats, 2: Boarding/Dropping, 3: Passenger & Pay
  const [selectedSeats, setSelectedSeats] = useState<BusSeat[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<BusBoardingPoint | null>(null);
  const [selectedDropping, setSelectedDropping] = useState<BusBoardingPoint | null>(null);

  // Passenger state
  const [passengers, setPassengers] = useState<Array<{ name: string; age: number; gender: string }>>([
    { name: 'Arjun Verma', age: 29, gender: 'Male' },
  ]);
  const [phone, setPhone] = useState('9876543210');
  const [email, setEmail] = useState('arjun.v@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  React.useEffect(() => {
    if (bus) {
      setSelectedBoarding(bus.boardingPoints[0] || null);
      setSelectedDropping(bus.droppingPoints[0] || null);
      setSelectedSeats([]);
      setStep(1);
    }
  }, [bus]);

  if (!isOpen || !bus) return null;

  const handleToggleSeat = (seat: BusSeat) => {
    if (seat.isBooked) return;
    const exists = selectedSeats.find((s) => s.id === seat.id);
    if (exists) {
      const next = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(next);
      // Adjust passenger list length to match seat count
      if (next.length > 0) {
        setPassengers(passengers.slice(0, next.length));
      }
    } else {
      if (selectedSeats.length >= 6) return;
      const next = [...selectedSeats, seat];
      setSelectedSeats(next);
      if (next.length > passengers.length) {
        setPassengers([
          ...passengers,
          { name: '', age: 25, gender: 'Female' },
        ]);
      }
    }
  };

  const handleUpdatePassenger = (index: number, field: string, val: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: val };
    setPassengers(updated);
  };

  const seatTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const operatorGst = Math.round(seatTotal * 0.05);
  const totalAmount = seatTotal + operatorGst;

  const handleCompleteBooking = () => {
    const bookingId = `BUS-${Math.floor(100000 + Math.random() * 900000)}`;
    const pnr = `RB-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newTicket: ConfirmedTicket = {
      id: bookingId,
      pnr,
      category: 'buses',
      title: bus.operator,
      subtitle: `${bus.busType} · ${bus.fromCity} to ${bus.toCity}`,
      bookingTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      journeyDate,
      time: `${bus.departureTime} Departure → ${bus.arrivalTime} Arrival`,
      locationOrRoute: `${selectedBoarding?.location} → ${selectedDropping?.location}`,
      seatSummary: `Seats: ${selectedSeats.map((s) => s.seatNumber).join(', ')} (${selectedSeats.length} Berths)`,
      seatNumbers: selectedSeats.map((s) => s.seatNumber),
      passengerSummary: `${passengers.length} Passenger(s)`,
      passengers: passengers.map((p, idx) => ({
        name: p.name || `Passenger ${idx + 1}`,
        details: `Age ${p.age} · ${p.gender} · Seat: ${selectedSeats[idx]?.seatNumber || 'N/A'}`,
      })),
      baseAmount: seatTotal,
      taxAndFees: operatorGst,
      discount: 0,
      totalAmount,
      status: 'CONFIRMED',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pnr)}`,
      barcodeNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      extraDetails: {
        'Boarding Point': `${selectedBoarding?.location} (${selectedBoarding?.time})`,
        'Dropping Point': `${selectedDropping?.location} (${selectedDropping?.time})`,
        'Emergency Helpline': '1800-102-8747',
        'Bus Features': bus.amenities.slice(0, 3).join(', '),
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
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600/10 text-rose-500">
              <BusIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-rose-500 uppercase tracking-wider">Bus Ticket</span>
                <span aria-hidden="true">·</span>
                <span>{bus.fromCity} → {bus.toCity}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                {bus.operator}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400">
              <span className={`px-2 py-0.5 rounded ${step === 1 ? 'bg-rose-600 text-white font-semibold' : ''}`}>1. Seats</span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded ${step === 2 ? 'bg-rose-600 text-white font-semibold' : ''}`}>2. Boarding</span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded ${step === 3 ? 'bg-rose-600 text-white font-semibold' : ''}`}>3. Pay</span>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* STEP 1: Select Bus Berths */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs text-neutral-300">
                <div>
                  <span className="font-semibold text-white">{bus.busType}</span>
                </div>
                <div className="font-mono text-rose-400 font-bold">
                  {selectedSeats.length} Berth(s) Chosen
                </div>
              </div>

              <BusSeatMap
                seats={bus.seats}
                selectedSeatIds={selectedSeats.map((s) => s.id)}
                onToggleSeat={handleToggleSeat}
              />
            </div>
          )}

          {/* STEP 2: Boarding & Dropping Points */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Select Boarding Point in {bus.fromCity}
                </h3>
                <div className="space-y-2">
                  {bus.boardingPoints.map((bp) => {
                    const isSelected = selectedBoarding?.id === bp.id;
                    return (
                      <button
                        key={bp.id}
                        type="button"
                        onClick={() => setSelectedBoarding(bp)}
                        className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500/30'
                            : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-sm font-semibold">{bp.location}</div>
                          <div className="text-xs text-neutral-400">{bp.landmark}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-rose-400">{bp.time}</span>
                          <span className="text-[10px] text-neutral-500 block">Pickup</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Select Dropping Point in {bus.toCity}
                </h3>
                <div className="space-y-2">
                  {bus.droppingPoints.map((dp) => {
                    const isSelected = selectedDropping?.id === dp.id;
                    return (
                      <button
                        key={dp.id}
                        type="button"
                        onClick={() => setSelectedDropping(dp)}
                        className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500/30'
                            : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-sm font-semibold">{dp.location}</div>
                          <div className="text-xs text-neutral-400">{dp.landmark}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400">{dp.time}</span>
                          <span className="text-[10px] text-neutral-500 block">Drop-off</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Passengers & Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Passenger Information ({passengers.length})
                </h3>

                <div className="space-y-3">
                  {passengers.map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-2"
                    >
                      <div className="text-xs font-medium text-neutral-400">
                        Seat {selectedSeats[idx]?.seatNumber || idx + 1}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            placeholder="Passenger Name"
                            value={p.name}
                            onChange={(e) => handleUpdatePassenger(idx, 'name', e.target.value)}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            placeholder="Age"
                            min="5"
                            max="99"
                            value={p.age}
                            onChange={(e) => handleUpdatePassenger(idx, 'age', Number(e.target.value))}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <select
                            value={p.gender}
                            onChange={(e) => handleUpdatePassenger(idx, 'gender', e.target.value)}
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Email ID</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                      <div className="text-xs font-semibold">Fast UPI</div>
                      <div className="text-[10px] text-neutral-400">Zero surcharge</div>
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
                      <div className="text-xs font-semibold">Debit / Credit Card</div>
                      <div className="text-[10px] text-neutral-400">Instant confirm</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-4 flex items-center justify-between">
          <div>
            {selectedSeats.length > 0 && (
              <div className="text-xs">
                <span className="text-neutral-400">Total: </span>
                <span className="text-base font-bold text-white font-mono">₹{totalAmount}</span>
                <span className="text-neutral-400 ml-2">({selectedSeats.length} seat(s))</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step === 1 && (
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-40 transition-colors"
              >
                <span>Select Boarding</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                <span>Continue to Passenger</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-colors"
              >
                <span>Pay ₹{totalAmount} & Confirm</span>
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
