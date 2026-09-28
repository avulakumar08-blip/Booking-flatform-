import React, { useState } from 'react';
import { BusSeat } from '../../types/booking';
import { Compass } from 'lucide-react';

interface BusSeatMapProps {
  seats: BusSeat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: BusSeat) => void;
}

export const BusSeatMap: React.FC<BusSeatMapProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
}) => {
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  const lowerSeats = seats.filter((s) => s.deck === 'lower');
  const upperSeats = seats.filter((s) => s.deck === 'upper');

  const currentDeckSeats = activeDeck === 'lower' ? lowerSeats : upperSeats;

  return (
    <div className="flex flex-col items-center w-full select-none space-y-4">
      {/* Deck Switcher Tabs (Segmented Button Controls) */}
      <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
        <button
          type="button"
          onClick={() => setActiveDeck('lower')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeDeck === 'lower'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Lower Deck ({lowerSeats.filter((s) => !s.isBooked).length} Free)
        </button>

        <button
          type="button"
          onClick={() => setActiveDeck('upper')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeDeck === 'upper'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Upper Deck ({upperSeats.filter((s) => !s.isBooked).length} Free)
        </button>
      </div>

      {/* Bus Body Layout */}
      <div className="relative w-full max-w-sm rounded-2xl border-2 border-neutral-700 bg-neutral-950 p-4 shadow-xl">
        {/* Front of Bus (Steering wheel indicator) */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
            <Compass className="h-3.5 w-3.5 text-rose-500 animate-spin-slow" />
            <span>Front / Cabin</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-400">
            <span className="font-mono font-bold text-white uppercase">{activeDeck} Deck</span>
          </div>
        </div>

        {/* Sleeper Berths Grid (2 + 1 format) */}
        <div className="grid grid-cols-3 gap-3">
          {currentDeckSeats.map((seat, index) => {
            const isSelected = selectedSeatIds.includes(seat.id);
            const isSold = seat.isBooked;
            const isFemale = seat.isFemaleBooked;

            // In a 2+1 layout, place single sleeper on left column, then 2 sleepers on right
            return (
              <button
                key={seat.id}
                type="button"
                disabled={isSold}
                onClick={() => onToggleSeat(seat)}
                className={`relative flex flex-col items-center justify-between p-2 h-16 rounded-xl border transition-all text-xs font-mono font-bold ${
                  isSold
                    ? isFemale
                      ? 'border-pink-900/60 bg-pink-950/20 text-pink-400/50 cursor-not-allowed'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-600 cursor-not-allowed'
                    : isSelected
                    ? 'border-rose-500 bg-rose-600 text-white shadow-md shadow-rose-600/40 ring-1 ring-rose-400'
                    : 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-rose-500 hover:text-white'
                }`}
                title={
                  isSold
                    ? `Seat ${seat.seatNumber} (Booked${isFemale ? ' by Female' : ''})`
                    : `Seat ${seat.seatNumber} - ₹${seat.price}`
                }
              >
                {/* Berth Pillow headrest */}
                <div
                  className={`w-full h-1.5 rounded-t ${
                    isSelected ? 'bg-rose-400' : isSold ? 'bg-neutral-800' : 'bg-neutral-700'
                  }`}
                />

                <span className="text-[11px] font-bold">{seat.seatNumber}</span>

                <span className="text-[9px] font-sans font-normal opacity-75">
                  ₹{seat.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rear of bus */}
        <div className="mt-4 pt-2 border-t border-neutral-800 text-center text-[10px] text-neutral-400">
          Rear Coach
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded border border-neutral-700 bg-neutral-900" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded bg-rose-600 ring-1 ring-rose-400" />
          <span className="text-white">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded bg-neutral-800 border border-neutral-800" />
          <span>Sold</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded bg-pink-950/40 border border-pink-800 text-pink-400 text-[9px] flex items-center justify-center">♀</div>
          <span>Female Reserved</span>
        </div>
      </div>
    </div>
  );
};
