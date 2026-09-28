import React, { useState, useMemo } from 'react';
import { 
  Bus as BusIcon, 
  ArrowLeftRight, 
  Calendar, 
  MapPin, 
  Star, 
  Wifi, 
  BatteryCharging, 
  ShieldCheck, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Bus } from '../../types/booking';
import { BUSES } from '../../data/mockData';

interface BusesSectionProps {
  onSelectBus: (bus: Bus, journeyDate: string) => void;
  selectedCity: string;
}

export const BusesSection: React.FC<BusesSectionProps> = ({
  onSelectBus,
  selectedCity,
}) => {
  const [fromCity, setFromCity] = useState(selectedCity || 'Mumbai');
  const [toCity, setToCity] = useState('Goa');
  const [journeyDate, setJourneyDate] = useState('Tomorrow, 28 Sep 2026');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ac-sleeper' | 'high-rated'>('all');

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const filteredBuses = useMemo(() => {
    return BUSES.filter((b) => {
      if (activeFilter === 'ac-sleeper') return b.hasAC && b.hasSleeper;
      if (activeFilter === 'high-rated') return b.rating >= 4.8;
      return true;
    });
  }, [activeFilter]);

  return (
    <div className="space-y-8 pb-16">
      {/* Bus Search Box */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <BusIcon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Intercity Bus Tickets & Luxury Sleepers
                </h2>
                <p className="text-xs text-neutral-400">
                  Select upper or lower berths, live GPS tracking & hygienic rest stops
                </p>
              </div>
            </div>

            {/* Quick route suggestions */}
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>Popular:</span>
              <button
                type="button"
                onClick={() => { setFromCity('Mumbai'); setToCity('Goa'); }}
                className="hover:text-rose-400 underline underline-offset-4"
              >
                Mumbai → Goa
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => { setFromCity('Bengaluru'); setToCity('Hyderabad'); }}
                className="hover:text-rose-400 underline underline-offset-4"
              >
                BLR → HYD
              </button>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From */}
            <div className="md:col-span-4 relative">
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                Departure City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Swap */}
            <div className="md:col-span-1 flex justify-center pt-4 md:pt-4">
              <button
                type="button"
                onClick={swapCities}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white transition-all shadow-sm"
                title="Swap cities"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-4 relative">
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                Destination City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-3 relative">
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs (Zero-Pill discipline compliant) */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Buses ({BUSES.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('ac-sleeper')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeFilter === 'ac-sleeper'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            AC Sleepers Only
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('high-rated')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeFilter === 'high-rated'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Top Rated (4.8★+)
          </button>
        </div>

        <span className="text-xs text-neutral-400">
          Prices inclusive of all taxes
        </span>
      </section>

      {/* Buses List */}
      <section className="space-y-4">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-6 transition-all hover:border-neutral-700 space-y-4"
          >
            {/* Operator Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">{bus.operator}</h3>
                  <div className="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span>{bus.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{bus.busType}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-emerald-400">
                  {bus.seatsAvailable} Seats Available
                </span>
                <span>·</span>
                <span>{bus.reviewCount} Reviews</span>
              </div>
            </div>

            {/* Travel Times Grid */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
              {/* Departure */}
              <div className="space-y-0.5">
                <div className="text-lg sm:text-xl font-bold font-mono text-white">
                  {bus.departureTime}
                </div>
                <div className="text-xs font-semibold text-neutral-300">
                  {bus.fromCity}
                </div>
                <div className="text-[11px] text-neutral-400 truncate max-w-xs">
                  {bus.boardingPoints[0]?.location}
                </div>
              </div>

              {/* Journey Duration */}
              <div className="flex flex-col items-center justify-center px-4">
                <span className="text-xs font-mono text-neutral-400">{bus.duration}</span>
                <div className="relative flex items-center w-28 sm:w-40 my-1">
                  <div className="h-[2px] w-full bg-neutral-700" />
                  <div className="absolute left-0 h-2 w-2 rounded-full bg-rose-500" />
                  <div className="absolute right-0 h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-neutral-400">Direct Express</span>
              </div>

              {/* Arrival */}
              <div className="space-y-0.5 sm:text-right">
                <div className="text-lg sm:text-xl font-bold font-mono text-white">
                  {bus.arrivalTime}
                </div>
                <div className="text-xs font-semibold text-neutral-300">
                  {bus.toCity}
                </div>
                <div className="text-[11px] text-neutral-400 truncate max-w-xs">
                  {bus.droppingPoints[0]?.location}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0 sm:border-l sm:pl-6">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Starts from</span>
                  <div className="text-xl font-bold font-mono text-rose-400">
                    ₹{bus.startingPrice}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBus(bus, journeyDate)}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/20"
                >
                  <span>Select Seats</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Amenities Line */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-neutral-400 border-t border-neutral-800/60">
              {bus.amenities.map((amenity, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-neutral-500" />
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
