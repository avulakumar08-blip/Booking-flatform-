import React, { useState, useMemo } from 'react';
import { 
  Train as TrainIcon, 
  ArrowLeftRight, 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  ChevronRight, 
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { Train, TrainClassOption, TrainSchedule } from '../../types/booking';
import { TRAINS } from '../../data/mockData';

interface TrainsSectionProps {
  onBookTrain: (train: Train, selectedClass: TrainClassOption, journeyDate: string) => void;
  selectedCity: string;
}

export const TrainsSection: React.FC<TrainsSectionProps> = ({
  onBookTrain,
  selectedCity,
}) => {
  const [fromQuery, setFromQuery] = useState('New Delhi (NDLS)');
  const [toQuery, setToQuery] = useState('Mumbai Central (MMCT)');
  const [journeyDate, setJourneyDate] = useState('Tomorrow, 28 Sep 2026');
  const [selectedQuota, setSelectedQuota] = useState('General');

  // Schedule modal state
  const [activeScheduleTrain, setActiveScheduleTrain] = useState<Train | null>(null);

  const swapStations = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const filteredTrains = useMemo(() => {
    return TRAINS;
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Train Search Widget Bar */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                <TrainIcon className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  IRCTC Train Ticket Reservation
                </h2>
                <p className="text-xs text-neutral-400">
                  Instant PNR generation, Tatkal allocation & live running timetable
                </p>
              </div>
            </div>

            {/* Quota Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Quota:</span>
              <select
                value={selectedQuota}
                onChange={(e) => setSelectedQuota(e.target.value)}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 focus:border-rose-500 focus:outline-none"
              >
                <option value="General">General (GN)</option>
                <option value="Tatkal">Tatkal (TQ)</option>
                <option value="Ladies">Ladies (LD)</option>
                <option value="Senior Citizen">Senior Citizen (SS)</option>
              </select>
            </div>
          </div>

          {/* Station & Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* From */}
            <div className="md:col-span-4 relative">
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                From Station
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                <input
                  type="text"
                  value={fromQuery}
                  onChange={(e) => setFromQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-4 md:pt-4">
              <button
                type="button"
                onClick={swapStations}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white transition-all shadow-sm"
                title="Swap stations"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            {/* To */}
            <div className="md:col-span-4 relative">
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                To Station
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <input
                  type="text"
                  value={toQuery}
                  onChange={(e) => setToQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-3 relative">
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                Date of Journey
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

      {/* Available Trains List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-display">
            Available Trains ({filteredTrains.length})
          </h3>
          <span className="text-xs text-neutral-400">
            Official IRCTC Authorized Booking Gateway
          </span>
        </div>

        <div className="space-y-4">
          {filteredTrains.map((train) => (
            <div
              key={train.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-6 transition-all hover:border-neutral-700 space-y-4"
            >
              {/* Top Train Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                      #{train.number}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white">{train.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <span>Runs On: {train.runningDays.join(', ')}</span>
                    <span>·</span>
                    <span>{train.foodProvided ? 'Pantry Car Available' : 'No Pantry'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveScheduleTrain(train)}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>View Train Route & Halts</span>
                </button>
              </div>

              {/* Timing Grid */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
                {/* Departure */}
                <div className="space-y-0.5">
                  <div className="text-lg sm:text-xl font-bold font-mono text-white">
                    {train.departureTime}
                  </div>
                  <div className="text-xs font-semibold text-neutral-300">
                    {train.fromStation} ({train.fromCode})
                  </div>
                  <div className="text-[11px] text-neutral-400">Origin Terminal</div>
                </div>

                {/* Duration line */}
                <div className="flex flex-col items-center justify-center px-4">
                  <span className="text-xs font-mono text-neutral-400">{train.duration}</span>
                  <div className="relative flex items-center w-32 sm:w-48 my-1">
                    <div className="h-[2px] w-full bg-neutral-700" />
                    <div className="absolute left-0 h-2 w-2 rounded-full bg-rose-500" />
                    <div className="absolute right-0 h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {train.routeStops.length - 2} Intermediate Halts
                  </span>
                </div>

                {/* Arrival */}
                <div className="space-y-0.5 sm:text-right">
                  <div className="text-lg sm:text-xl font-bold font-mono text-white">
                    {train.arrivalTime}
                  </div>
                  <div className="text-xs font-semibold text-neutral-300">
                    {train.toStation} ({train.toCode})
                  </div>
                  <div className="text-[11px] text-neutral-400">Destination Station</div>
                </div>
              </div>

              {/* Class Option Cards (1A, 2A, 3A, SL, CC) */}
              <div className="pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Select Coach Class & Check Live Seat Availability
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {train.classes.map((cls) => (
                    <div
                      key={cls.code}
                      className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 hover:border-neutral-700 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white font-mono">{cls.code}</span>
                        <span className="text-xs font-bold text-rose-400 font-mono">₹{cls.price}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] text-neutral-400 truncate">{cls.name}</div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 font-mono">
                          <CheckCircle className="h-3 w-3" />
                          <span>{cls.statusText}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onBookTrain(train, cls, journeyDate)}
                        className="w-full flex items-center justify-center gap-1 rounded-lg bg-neutral-800 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
                      >
                        <span>Book {cls.code}</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Train Schedule Modal */}
      {activeScheduleTrain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeScheduleTrain.name} (#{activeScheduleTrain.number})
                </h3>
                <p className="text-xs text-neutral-400">Timetable & Halting Stations</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveScheduleTrain(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 sm:p-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-semibold">
                    <th className="pb-2">Station</th>
                    <th className="pb-2">Arr.</th>
                    <th className="pb-2">Dep.</th>
                    <th className="pb-2">Halt</th>
                    <th className="pb-2">Dist.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {activeScheduleTrain.routeStops.map((stop) => (
                    <tr key={stop.stationCode} className="text-neutral-300">
                      <td className="py-2.5 font-sans font-medium text-white">
                        {stop.stationName} ({stop.stationCode})
                      </td>
                      <td className="py-2.5">{stop.arrivalTime}</td>
                      <td className="py-2.5">{stop.departureTime}</td>
                      <td className="py-2.5">{stop.haltMinutes > 0 ? `${stop.haltMinutes}m` : '-'}</td>
                      <td className="py-2.5">{stop.distanceKm} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-right">
              <button
                type="button"
                onClick={() => setActiveScheduleTrain(null)}
                className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
              >
                Close Timetable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
