import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Printer, 
  Download, 
  Share2, 
  Calendar, 
  MapPin, 
  Ticket as TicketIcon, 
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { ConfirmedTicket } from '../../types/booking';

interface TicketSuccessModalProps {
  ticket: ConfirmedTicket | null;
  isOpen: boolean;
  onCloseWindow: () => void;
  onNavigateToMyBookings?: () => void;
}

export const TicketSuccessModal: React.FC<TicketSuccessModalProps> = ({
  ticket,
  isOpen,
  onCloseWindow,
  onNavigateToMyBookings,
}) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCloseWindow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCloseWindow]);

  if (!isOpen || !ticket) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket Confirmed: ${ticket.title}`,
        text: `Booking PNR ${ticket.pnr} for ${ticket.title} on ${ticket.journeyDate}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Booking PNR: ${ticket.pnr} | ${ticket.title} | Seats: ${ticket.seatNumbers.join(', ')}`);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl my-auto overflow-hidden rounded-2xl border border-neutral-700/80 bg-neutral-900 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Window Bar with Explicit Close Affordance */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Booking Confirmed · E-Ticket Issued
            </span>
          </div>

          {/* User Requested: Easy Close Window Action */}
          <button
            type="button"
            onClick={onCloseWindow}
            className="group flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800 hover:text-white transition-all shadow-sm"
            title="Close this ticket window (Esc)"
          >
            <span>Close Window</span>
            <X className="h-4 w-4 text-neutral-400 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>

        {/* Ticket Header Graphic */}
        <div className="relative border-b border-dashed border-neutral-800 bg-gradient-to-r from-rose-950/40 via-neutral-900 to-neutral-900 px-6 sm:px-8 pt-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold uppercase tracking-wider text-rose-400">
                  {ticket.category.toUpperCase()} TICKET
                </span>
                <span aria-hidden="true">·</span>
                <span>Booking ID: <strong className="font-mono text-neutral-200">{ticket.id}</strong></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                {ticket.title}
              </h2>
              <p className="text-sm text-neutral-300 font-medium">
                {ticket.subtitle}
              </p>
            </div>

            {/* PNR Stamp */}
            <div className="flex flex-col items-start sm:items-end justify-center rounded-xl border border-neutral-700/60 bg-neutral-950/80 px-4 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">PNR NUMBER</span>
              <span className="font-mono text-base sm:text-lg font-bold text-rose-400 tracking-wider">
                {ticket.pnr}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Notches & Ticket Body */}
        <div className="relative bg-neutral-900 px-6 sm:px-8 py-6 space-y-6">
          {/* Half-circle cutout illusion on sides */}
          <div className="absolute -left-3 top-[-12px] h-6 w-6 rounded-full bg-black/85 border-r border-neutral-700" />
          <div className="absolute -right-3 top-[-12px] h-6 w-6 rounded-full bg-black/85 border-l border-neutral-700" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Calendar className="h-3.5 w-3.5 text-rose-500" />
                <span>Date & Schedule</span>
              </div>
              <p className="text-sm font-semibold text-white">{ticket.journeyDate}</p>
              <div className="flex items-center gap-1 text-xs text-neutral-300 font-mono">
                <Clock className="h-3 w-3 text-neutral-500" />
                <span>{ticket.time}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                <span>Venue / Route</span>
              </div>
              <p className="text-sm font-semibold text-white">{ticket.locationOrRoute}</p>
              <p className="text-xs text-neutral-400">{ticket.subtitle}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <TicketIcon className="h-3.5 w-3.5 text-rose-500" />
                <span>Seats & Quantity</span>
              </div>
              <p className="text-sm font-bold text-rose-400 font-mono">
                {ticket.seatNumbers.join(', ')}
              </p>
              <p className="text-xs text-neutral-300">{ticket.seatSummary}</p>
            </div>
          </div>

          {/* Passenger & Extra Meta */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Passenger & Attendee Breakdown
            </h4>
            <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-800/80 bg-neutral-950/40">
              {ticket.passengers.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-bold text-neutral-300">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-white">{p.name}</span>
                  </div>
                  <span className="text-xs text-neutral-400">{p.details}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fare Summary & QR/Barcode Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2 border-t border-neutral-800">
            {/* Payment Summary */}
            <div className="w-full sm:w-auto space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">Payment Verified · Instant Entry</span>
              </div>
              <div className="text-xs text-neutral-400 space-x-2">
                <span>Base: ₹{ticket.baseAmount}</span>
                <span>·</span>
                <span>Taxes & Fees: ₹{ticket.taxAndFees}</span>
                {ticket.discount > 0 && <span>· Disc: -₹{ticket.discount}</span>}
              </div>
              <div className="text-lg font-bold text-white tabular-nums">
                Total Paid: <span className="text-emerald-400">₹{ticket.totalAmount}</span>
              </div>
            </div>

            {/* Realistic Digital QR & Barcode */}
            <div className="flex items-center gap-4 p-3 rounded-xl border border-neutral-800 bg-neutral-950">
              {/* QR Mock */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-white p-1 rounded-md flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticket.pnr)}`}
                    alt="Ticket QR Verification"
                    className="h-full w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="mt-1 text-[9px] font-mono text-neutral-400">SCAN AT GATE</span>
              </div>

              {/* Barcode Mock */}
              <div className="flex flex-col items-start justify-center border-l border-neutral-800 pl-3">
                <div className="flex items-end gap-[2px] h-9">
                  {[2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2].map((height, i) => (
                    <div 
                      key={i} 
                      className={`w-[2px] bg-neutral-300`} 
                      style={{ height: `${height * 7}px` }} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-neutral-400 mt-1 tracking-widest">
                  {ticket.barcodeNumber.slice(0, 10)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Explicit Window Closing Controls */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Utility actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
                title="Print ticket"
              >
                <Printer className="h-3.5 w-3.5 text-neutral-400" />
                <span>Print</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 transition-colors"
                title="Share ticket details"
              >
                <Share2 className="h-3.5 w-3.5 text-neutral-400" />
                <span>{copyFeedback ? 'Copied!' : 'Share'}</span>
              </button>

              {onNavigateToMyBookings && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseWindow();
                    onNavigateToMyBookings();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
                >
                  <span>My Bookings</span>
                  <ArrowRight className="h-3 w-3 text-neutral-500" />
                </button>
              )}
            </div>

            {/* Primary Prominent Close Window Button */}
            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={onCloseWindow}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                <span>Close Window & Done</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
