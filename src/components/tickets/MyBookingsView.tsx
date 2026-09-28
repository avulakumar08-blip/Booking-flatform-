import React, { useState } from 'react';
import { 
  Ticket, 
  Film, 
  Train, 
  Bus, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { ConfirmedTicket } from '../../types/booking';

interface MyBookingsViewProps {
  tickets: ConfirmedTicket[];
  onOpenTicketWindow: (ticket: ConfirmedTicket) => void;
  onCancelTicket: (ticketId: string) => void;
  onStartBooking: (category: 'movies' | 'trains' | 'buses') => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  tickets,
  onOpenTicketWindow,
  onCancelTicket,
  onStartBooking,
}) => {
  const [filter, setFilter] = useState<'all' | 'movies' | 'trains' | 'buses'>('all');
  const [ticketToCancel, setTicketToCancel] = useState<ConfirmedTicket | null>(null);

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'all') return true;
    return t.category === filter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'movies':
        return <Film className="h-4 w-4 text-rose-500" />;
      case 'trains':
        return <Train className="h-4 w-4 text-sky-400" />;
      case 'buses':
        return <Bus className="h-4 w-4 text-emerald-400" />;
      default:
        return <Ticket className="h-4 w-4 text-rose-500" />;
    }
  };

  const handleConfirmCancel = () => {
    if (ticketToCancel) {
      onCancelTicket(ticketToCancel.id);
      setTicketToCancel(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            My Bookings & Digital Passes
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access your movie seats, train PNR status, and bus boarding passes anytime
          </p>
        </div>

        {/* Filter Tabs (Zero-Pill Discipline compliant) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({tickets.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('movies')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'movies'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Movies
          </button>

          <button
            type="button"
            onClick={() => setFilter('trains')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'trains'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Trains
          </button>

          <button
            type="button"
            onClick={() => setFilter('buses')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'buses'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Buses
          </button>
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/60 p-12 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400">
            <Ticket className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-neutral-400 max-w-sm">
              You do not have any confirmed tickets under this category yet. Book movies, trains, or buses in seconds.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onStartBooking('movies')}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500"
            >
              Book a Movie
            </button>
            <button
              type="button"
              onClick={() => onStartBooking('trains')}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
            >
              Book Train
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTickets.map((ticket) => {
            const isCancelled = ticket.status === 'CANCELLED';

            return (
              <div
                key={ticket.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
                  isCancelled
                    ? 'border-neutral-800/60 bg-neutral-900/40 opacity-75'
                    : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:shadow-xl'
                }`}
              >
                {/* Top strip with Category & PNR */}
                <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/70 px-5 py-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(ticket.category)}
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      {ticket.category} Ticket
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-rose-400">
                      PNR: {ticket.pnr}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCancelled
                          ? 'bg-neutral-800 text-neutral-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* Main Card Body */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-0.5">{ticket.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                        <Calendar className="h-3 w-3 text-rose-500" />
                        <span>Date & Schedule</span>
                      </div>
                      <p className="font-medium text-white">{ticket.journeyDate}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{ticket.time}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                        <MapPin className="h-3 w-3 text-rose-500" />
                        <span>Venue / Terminals</span>
                      </div>
                      <p className="font-medium text-white truncate">{ticket.locationOrRoute}</p>
                      <p className="text-[11px] text-rose-400 font-mono font-bold">
                        Seats: {ticket.seatNumbers.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Passengers Pill unboxed text */}
                  <div className="rounded-lg bg-neutral-950/60 p-2.5 text-xs text-neutral-300 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400">{ticket.passengerSummary}</span>
                    <span className="font-mono font-bold text-white">₹{ticket.totalAmount}</span>
                  </div>
                </div>

                {/* Footer Controls: Open Ticket Window & Cancel Option */}
                <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950/40 px-5 py-3">
                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() => setTicketToCancel(ticket)}
                      className="text-xs text-neutral-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                      title="Cancel booking"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {isCancelled && (
                    <span className="text-xs text-neutral-500 italic">
                      Refund credited to original payment
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenTicketWindow(ticket)}
                    className="flex items-center gap-1.5 rounded-lg bg-neutral-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition-colors ml-auto"
                  >
                    <span>Open E-Ticket Window</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {ticketToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cancel Booking?</h3>
                <p className="text-xs text-neutral-400">PNR: {ticketToCancel.pnr}</p>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-950 p-4 text-xs space-y-2">
              <div className="flex justify-between text-neutral-300">
                <span>Total Paid</span>
                <span className="font-mono text-white">₹{ticketToCancel.totalAmount}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Standard Cancellation Fee (10%)</span>
                <span className="font-mono text-rose-400">-₹{Math.round(ticketToCancel.totalAmount * 0.1)}</span>
              </div>
              <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-emerald-400">
                <span>Estimated Refund</span>
                <span className="font-mono">₹{Math.round(ticketToCancel.totalAmount * 0.9)}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400">
              The refund amount will be credited back to your original payment method within 2–4 business days.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTicketToCancel(null)}
                className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30"
              >
                Yes, Cancel Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
