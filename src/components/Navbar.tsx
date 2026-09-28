import React from 'react';
import { Film, Train, Bus, Ticket, MapPin, ChevronDown } from 'lucide-react';
import { BookingCategory } from '../types/booking';

interface NavbarProps {
  activeCategory: BookingCategory;
  onSelectCategory: (category: BookingCategory) => void;
  selectedCity: string;
  onOpenCitySelector: () => void;
  bookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedCity,
  onOpenCitySelector,
  bookingsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Title (Single text element wordmark with clean accent dot) */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectCategory('movies')}
            className="flex items-center gap-2 text-left transition-opacity hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-white shadow-sm font-bold tracking-tight">
              BP
            </span>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              Booking<span className="text-rose-500">Platform</span>
            </span>
          </button>

          {/* Quick City Affordance */}
          <button
            type="button"
            onClick={onOpenCitySelector}
            className="hidden items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900/80 px-2.5 py-1.5 text-xs text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white sm:flex"
            title="Change City"
          >
            <MapPin className="h-3.5 w-3.5 text-rose-500" />
            <span className="font-medium">{selectedCity}</span>
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </button>
        </div>

        {/* Zone 2: 4 Clean Navigation Links / Categories */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory('movies')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              activeCategory === 'movies'
                ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
            }`}
          >
            <Film className="h-4 w-4" />
            <span className="whitespace-nowrap">Movies</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('trains')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              activeCategory === 'trains'
                ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
            }`}
          >
            <Train className="h-4 w-4" />
            <span className="whitespace-nowrap">Trains</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('buses')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              activeCategory === 'buses'
                ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
            }`}
          >
            <Bus className="h-4 w-4" />
            <span className="whitespace-nowrap">Buses</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions (My Bookings with Count Badge & Mobile City) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCitySelector}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white sm:hidden"
          >
            <MapPin className="h-3.5 w-3.5 text-rose-500" />
            <span>{selectedCity}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCategory('my-bookings')}
            className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all ${
              activeCategory === 'my-bookings'
                ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-500'
                : 'bg-neutral-900 text-neutral-200 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800'
            }`}
          >
            <Ticket className="h-3.5 w-3.5 text-rose-400" />
            <span className="whitespace-nowrap">My Bookings</span>
            {bookingsCount > 0 && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
