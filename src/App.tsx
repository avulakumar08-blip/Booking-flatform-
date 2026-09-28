import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CitySelectorModal } from './components/CitySelectorModal';
import { MoviesSection } from './components/movies/MoviesSection';
import { MovieBookingModal } from './components/movies/MovieBookingModal';
import { TrainsSection } from './components/trains/TrainsSection';
import { TrainBookingModal } from './components/trains/TrainBookingModal';
import { BusesSection } from './components/buses/BusesSection';
import { BusBookingModal } from './components/buses/BusBookingModal';
import { TicketSuccessModal } from './components/tickets/TicketSuccessModal';
import { MyBookingsView } from './components/tickets/MyBookingsView';
import { 
  BookingCategory, 
  Movie, 
  Train, 
  TrainClassOption, 
  Bus, 
  ConfirmedTicket 
} from './types/booking';
import { INITIAL_CONFIRMED_TICKETS } from './data/mockData';
import { Film, Train as TrainIcon, Bus as BusIcon, Shield, CheckCircle2, Ticket } from 'lucide-react';

const STORAGE_KEY = 'booking_platform_tickets_v1';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<BookingCategory>('movies');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  // Tickets State with LocalStorage
  const [tickets, setTickets] = useState<ConfirmedTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_CONFIRMED_TICKETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to sync tickets to storage', e);
    }
  }, [tickets]);

  // Active Modals State
  const [activeMovieForBooking, setActiveMovieForBooking] = useState<Movie | null>(null);
  
  const [activeTrainForBooking, setActiveTrainForBooking] = useState<{
    train: Train;
    cls: TrainClassOption;
    date: string;
  } | null>(null);

  const [activeBusForBooking, setActiveBusForBooking] = useState<{
    bus: Bus;
    date: string;
  } | null>(null);

  // Success / E-Ticket Window Modal (Crucial User Requirement: "where I can close the window after successfully booking")
  const [activeTicketWindow, setActiveTicketWindow] = useState<ConfirmedTicket | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Callback on successful booking from any vertical
  const handleBookingConfirmed = (newTicket: ConfirmedTicket) => {
    // Add to state
    setTickets((prev) => [newTicket, ...prev]);
    // Automatically open the e-ticket window modal
    setActiveTicketWindow(newTicket);
  };

  // Window Close Handler
  const handleCloseTicketWindow = () => {
    setActiveTicketWindow(null);
    triggerToast('Ticket window closed. You can access your ticket anytime in My Bookings.');
  };

  const handleCancelTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'CANCELLED' } : t))
    );
    triggerToast('Ticket cancelled. Refund initiated to source payment.');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        selectedCity={selectedCity}
        onOpenCitySelector={() => setIsCityModalOpen(true)}
        bookingsCount={tickets.filter((t) => t.status === 'CONFIRMED').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-neutral-700 bg-neutral-900/95 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-md animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Vertical View Routing */}
        {activeCategory === 'movies' && (
          <MoviesSection
            onSelectMovie={(movie) => setActiveMovieForBooking(movie)}
            selectedCity={selectedCity}
          />
        )}

        {activeCategory === 'trains' && (
          <TrainsSection
            onBookTrain={(train, cls, date) =>
              setActiveTrainForBooking({ train, cls, date })
            }
            selectedCity={selectedCity}
          />
        )}

        {activeCategory === 'buses' && (
          <BusesSection
            onSelectBus={(bus, date) => setActiveBusForBooking({ bus, date })}
            selectedCity={selectedCity}
          />
        )}

        {activeCategory === 'my-bookings' && (
          <MyBookingsView
            tickets={tickets}
            onOpenTicketWindow={(ticket) => setActiveTicketWindow(ticket)}
            onCancelTicket={handleCancelTicket}
            onStartBooking={(cat) => setActiveCategory(cat)}
          />
        )}
      </main>

      {/* Modals */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(c) => setSelectedCity(c)}
      />

      {/* Movie Booking Modal */}
      <MovieBookingModal
        movie={activeMovieForBooking}
        isOpen={Boolean(activeMovieForBooking)}
        onClose={() => setActiveMovieForBooking(null)}
        onBookingSuccess={handleBookingConfirmed}
        selectedCity={selectedCity}
      />

      {/* Train Booking Modal */}
      <TrainBookingModal
        train={activeTrainForBooking?.train || null}
        selectedClass={activeTrainForBooking?.cls || null}
        journeyDate={activeTrainForBooking?.date || ''}
        isOpen={Boolean(activeTrainForBooking)}
        onClose={() => setActiveTrainForBooking(null)}
        onBookingSuccess={handleBookingConfirmed}
      />

      {/* Bus Booking Modal */}
      <BusBookingModal
        bus={activeBusForBooking?.bus || null}
        journeyDate={activeBusForBooking?.date || ''}
        isOpen={Boolean(activeBusForBooking)}
        onClose={() => setActiveBusForBooking(null)}
        onBookingSuccess={handleBookingConfirmed}
      />

      {/* Primary Requested E-Ticket Window Modal with Close Action */}
      <TicketSuccessModal
        ticket={activeTicketWindow}
        isOpen={Boolean(activeTicketWindow)}
        onCloseWindow={handleCloseTicketWindow}
        onNavigateToMyBookings={() => setActiveCategory('my-bookings')}
      />

      {/* Quiet, Professional Footer */}
      <footer className="border-t border-neutral-800 bg-neutral-950 py-8 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-tight font-display">
              BookingPlatform
            </span>
            <span aria-hidden="true">·</span>
            <span>Movies, IRCTC Trains & Intercity Bus Tickets</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveCategory('movies')}
              className="hover:text-white transition-colors"
            >
              Movies
            </button>
            <button
              onClick={() => setActiveCategory('trains')}
              className="hover:text-white transition-colors"
            >
              Trains
            </button>
            <button
              onClick={() => setActiveCategory('buses')}
              className="hover:text-white transition-colors"
            >
              Buses
            </button>
            <button
              onClick={() => setActiveCategory('my-bookings')}
              className="hover:text-white transition-colors"
            >
              My Bookings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
