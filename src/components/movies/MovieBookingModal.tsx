import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Calendar, 
  Plus, 
  Minus, 
  CreditCard, 
  Sparkles, 
  Check, 
  Popcorn, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Movie, CinemaSeat, CinemaTheater, CinemaShowtime, SnackCombo, ConfirmedTicket } from '../../types/booking';
import { CinemaSeatMap } from './CinemaSeatMap';
import { SNACK_COMBOS } from '../../data/mockData';

interface MovieBookingModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (ticket: ConfirmedTicket) => void;
  selectedCity: string;
}

export const MovieBookingModal: React.FC<MovieBookingModalProps> = ({
  movie,
  isOpen,
  onClose,
  onBookingSuccess,
  selectedCity,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Theater & Time, 2: Seats, 3: F&B Snacks, 4: Payment

  // Dates (Today, Tomorrow, +2, +3)
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({
        label: `${dayName}, ${dayNum} ${month}`,
        shortDay: dayName,
        dateNumber: `${dayNum} ${month}`,
        isToday: i === 0,
      });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(dateOptions[0].label);
  const [selectedTheater, setSelectedTheater] = useState<CinemaTheater | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<CinemaShowtime | null>(null);

  // Seats State
  const [cinemaSeats, setCinemaSeats] = useState<CinemaSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<CinemaSeat[]>([]);

  // Snacks State
  const [snacks, setSnacks] = useState<SnackCombo[]>(SNACK_COMBOS);

  // Passenger/User Info
  const [email, setEmail] = useState('user.prime@example.com');
  const [phone, setPhone] = useState('9876543210');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);

  // Initialize seats when movie changes
  React.useEffect(() => {
    if (movie && movie.theaters.length > 0) {
      setSelectedTheater(movie.theaters[0]);
      setSelectedShowtime(movie.theaters[0].showtimes[0]);
      // Generate seat set
      import('../../data/mockData').then((mod) => {
        setCinemaSeats(mod.generateCinemaSeats());
      });
      setSelectedSeats([]);
      setStep(1);
    }
  }, [movie]);

  if (!isOpen || !movie) return null;

  // Toggle seat selection
  const handleToggleSeat = (seat: CinemaSeat) => {
    if (seat.isBooked) return;
    const exists = selectedSeats.find((s) => s.id === seat.id);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) return;
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleUpdateSnack = (id: string, delta: number) => {
    setSnacks(
      snacks.map((s) => {
        if (s.id === id) {
          const qty = Math.max(0, s.quantity + delta);
          return { ...s, quantity: qty };
        }
        return s;
      })
    );
  };

  // Calculations
  const seatsTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const snacksTotal = snacks.reduce((acc, s) => acc + s.price * s.quantity, 0);
  const baseTotal = seatsTotal + snacksTotal;
  const bookingFees = selectedSeats.length > 0 ? Math.round(selectedSeats.length * 35.4) : 0;
  const finalTotal = Math.max(0, baseTotal + bookingFees - discountApplied);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'WELCOME100') {
      setDiscountApplied(100);
    } else if (promoCode.trim().toUpperCase() === 'MOVIE50') {
      setDiscountApplied(50);
    }
  };

  const handleCompleteBooking = () => {
    const bookingId = `BKG-${Math.floor(100000 + Math.random() * 900000)}`;
    const pnr = `MV-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newTicket: ConfirmedTicket = {
      id: bookingId,
      pnr,
      category: 'movies',
      title: movie.title,
      subtitle: `${selectedTheater?.name} · ${selectedShowtime?.format} (${selectedShowtime?.screenName})`,
      bookingTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      journeyDate: selectedDate,
      time: `${selectedShowtime?.time} Show`,
      locationOrRoute: `${selectedTheater?.location}, ${selectedCity}`,
      seatSummary: `${selectedSeats.length} Seats · ${selectedSeats.map((s) => s.id).join(', ')}`,
      seatNumbers: selectedSeats.map((s) => s.id),
      passengerSummary: `${selectedSeats.length} Admissions (${email})`,
      passengers: selectedSeats.map((s, idx) => ({
        name: `Seat ${s.id} (${s.tier})`,
        details: idx === 0 ? `Primary Ticket Holder: ${phone}` : 'Cinema Guest Admission',
      })),
      baseAmount: baseTotal,
      taxAndFees: bookingFees,
      discount: discountApplied,
      totalAmount: finalTotal,
      status: 'CONFIRMED',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pnr)}`,
      barcodeNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      extraDetails: {
        Language: movie.languages[0],
        Certification: movie.certificate,
        Snacks: snacks.filter((s) => s.quantity > 0).map((s) => `${s.quantity}x ${s.name}`).join(', ') || 'None',
      },
    };

    onClose();
    onBookingSuccess(newTicket);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-4xl my-auto overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                title="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-rose-500 uppercase tracking-wider">Book Show</span>
                <span aria-hidden="true">·</span>
                <span>{movie.certificate}</span>
                <span aria-hidden="true">·</span>
                <span>{movie.duration}</span>
              </div>
              <h2 className="text-lg font-bold text-white font-display">{movie.title}</h2>
            </div>
          </div>

          {/* Stepper Progress & Close */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className={`px-2 py-0.5 rounded font-medium ${step === 1 ? 'bg-rose-600 text-white' : 'text-neutral-400'}`}>1. Time</span>
              <span className="text-neutral-600">→</span>
              <span className={`px-2 py-0.5 rounded font-medium ${step === 2 ? 'bg-rose-600 text-white' : 'text-neutral-400'}`}>2. Seats</span>
              <span className="text-neutral-600">→</span>
              <span className={`px-2 py-0.5 rounded font-medium ${step === 3 ? 'bg-rose-600 text-white' : 'text-neutral-400'}`}>3. Snacks</span>
              <span className="text-neutral-600">→</span>
              <span className={`px-2 py-0.5 rounded font-medium ${step === 4 ? 'bg-rose-600 text-white' : 'text-neutral-400'}`}>4. Pay</span>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* STEP 1: Date & Theater & Showtime */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Select Date
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedDate(opt.label)}
                      className={`flex flex-col items-center justify-center rounded-xl border px-4 py-2.5 min-w-24 transition-all ${
                        selectedDate === opt.label
                          ? 'border-rose-500 bg-rose-500/10 text-white ring-1 ring-rose-500/30'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      <span className="text-[11px] font-semibold">{opt.shortDay}</span>
                      <span className="text-sm font-bold text-white">{opt.dateNumber}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theaters List */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Select Cinema Hall & Showtime
                </label>
                <div className="space-y-4">
                  {movie.theaters.map((theater) => (
                    <div 
                      key={theater.id}
                      className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <h4 className="text-sm font-semibold text-white">{theater.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-neutral-400">
                            <MapPin className="h-3 w-3 text-rose-500" />
                            <span>{theater.location}</span>
                            <span>·</span>
                            <span>{theater.distance}</span>
                          </div>
                        </div>
                        {theater.cancellationAllowed && (
                          <span className="text-[11px] text-emerald-400 font-medium">
                            Cancellation Available
                          </span>
                        )}
                      </div>

                      {/* Showtimes Pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {theater.showtimes.map((st) => {
                          const isSelected = selectedTheater?.id === theater.id && selectedShowtime?.id === st.id;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => {
                                setSelectedTheater(theater);
                                setSelectedShowtime(st);
                              }}
                              className={`flex flex-col items-center justify-center rounded-lg border px-3.5 py-2 transition-all ${
                                isSelected
                                  ? 'border-rose-500 bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                  : 'border-neutral-800 bg-neutral-900 text-neutral-200 hover:border-neutral-700 hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-bold font-mono">{st.time}</span>
                              <span className="text-[10px] opacity-80">{st.format}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Interactive Seat Map */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 text-xs text-neutral-300">
                <div>
                  <span className="font-semibold text-white">{selectedTheater?.name}</span>
                  <span className="mx-2 text-neutral-600">·</span>
                  <span>{selectedShowtime?.format} ({selectedShowtime?.time})</span>
                </div>
                <div className="font-mono text-rose-400 font-bold">
                  {selectedSeats.length} Seats Selected
                </div>
              </div>

              <CinemaSeatMap
                seats={cinemaSeats}
                selectedSeatIds={selectedSeats.map((s) => s.id)}
                onToggleSeat={handleToggleSeat}
              />
            </div>
          )}

          {/* STEP 3: Food & Snacks Combos */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Grab Cinema Snacks & Combos</h3>
                  <p className="text-xs text-neutral-400">Delivered directly to your seat during intermission</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-xs text-neutral-400 hover:text-white underline underline-offset-4"
                >
                  Skip F&B
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {snacks.map((snack) => (
                  <div
                    key={snack.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <Popcorn className="h-3.5 w-3.5 text-rose-400" />
                        <h4 className="text-sm font-medium text-white">{snack.name}</h4>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1">{snack.description}</p>
                      <span className="text-xs font-semibold text-rose-400">₹{snack.price}</span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateSnack(snack.id, -1)}
                        disabled={snack.quantity === 0}
                        className="rounded p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold font-mono text-white">
                        {snack.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateSnack(snack.id, 1)}
                        className="rounded p-1 text-neutral-400 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Payment */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Contact details & Payment Mode */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Email for E-Ticket</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 block mb-1">Mobile for SMS</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Offers & Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try WELCOME100"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs uppercase text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
                    >
                      Apply
                    </button>
                  </div>
                  {discountApplied > 0 && (
                    <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="h-3 w-3" /> ₹{discountApplied} discount applied successfully!
                    </p>
                  )}
                </div>

                {/* Payment Option */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Select Payment Method
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
                        <div className="text-xs font-semibold">Instant UPI / QR</div>
                        <div className="text-[10px] text-neutral-400">Google Pay, PhonePe, Paytm</div>
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
                        <div className="text-[10px] text-neutral-400">Visa, Mastercard, RuPay</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="md:col-span-5 rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Booking Breakdown
                </h4>

                <div className="space-y-2 text-xs divide-y divide-neutral-800/80">
                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-300">Movie Tickets ({selectedSeats.length})</span>
                    <span className="font-mono text-white">₹{seatsTotal}</span>
                  </div>

                  {snacksTotal > 0 && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-neutral-300">Snacks & Combos</span>
                      <span className="font-mono text-white">₹{snacksTotal}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-400">Convenience & GST</span>
                    <span className="font-mono text-neutral-300">₹{bookingFees}</span>
                  </div>

                  {discountApplied > 0 && (
                    <div className="flex justify-between py-1.5 text-emerald-400">
                      <span>Promo Discount</span>
                      <span className="font-mono">-₹{discountApplied}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 text-sm font-bold text-white">
                    <span>Total Amount</span>
                    <span className="text-rose-400 font-mono">₹{finalTotal}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-neutral-900 p-2.5 text-[11px] text-neutral-400 flex items-start gap-2">
                  <Info className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                  <span>After successful payment, an e-ticket window will open with your PNR and barcode. You can close the window anytime and access it from My Bookings.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-4 flex items-center justify-between">
          <div>
            {selectedSeats.length > 0 && (
              <div className="text-xs">
                <span className="text-neutral-400">Total: </span>
                <span className="text-base font-bold text-white font-mono">₹{finalTotal}</span>
                <span className="text-neutral-400 ml-2">({selectedSeats.length} seats)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                <span>Select Seats</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-40 transition-colors"
              >
                <span>Continue to Snacks</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                <span>Proceed to Pay</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-colors"
              >
                <span>Pay ₹{finalTotal} & Confirm Ticket</span>
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
