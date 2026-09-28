import React from 'react';
import { CinemaSeat } from '../../types/booking';

interface CinemaSeatMapProps {
  seats: CinemaSeat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: CinemaSeat) => void;
  maxSeats?: number;
}

export const CinemaSeatMap: React.FC<CinemaSeatMapProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  maxSeats = 8,
}) => {
  // Group seats by tier and row
  const tiers: ('Recliner' | 'Prime' | 'Classic')[] = ['Recliner', 'Prime', 'Classic'];

  const getTierPrice = (tier: string) => {
    if (tier === 'Recliner') return 450;
    if (tier === 'Prime') return 290;
    return 190;
  };

  return (
    <div className="flex flex-col items-center w-full select-none py-2">
      {/* Curved Screen Visualization */}
      <div className="w-full max-w-xl flex flex-col items-center mb-8">
        <div className="w-full h-8 relative flex items-center justify-center">
          {/* Subtle curved arc */}
          <div className="w-4/5 h-3 rounded-[50%] border-t-2 border-rose-500/80 shadow-[0_-8px_25px_rgba(244,63,94,0.35)]" />
        </div>
        <span className="text-[11px] font-semibold tracking-widest text-neutral-400 uppercase">
          Screen This Way
        </span>
      </div>

      {/* Seat Layout by Tiers */}
      <div className="w-full max-w-2xl space-y-6">
        {tiers.map((tier) => {
          const tierSeats = seats.filter((s) => s.tier === tier);
          const uniqueRows = Array.from(new Set(tierSeats.map((s) => s.row)));

          return (
            <div key={tier} className="space-y-2">
              {/* Tier Divider */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1 text-xs">
                <span className="font-semibold text-neutral-300 uppercase tracking-wider">
                  {tier} — ₹{getTierPrice(tier)}
                </span>
                <span className="text-neutral-500 text-[11px]">
                  {tier === 'Recliner' ? 'Luxury Sofa Recliners' : tier === 'Prime' ? 'Optimum Viewing Angle' : 'Standard Cinema Seating'}
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-2 py-1">
                {uniqueRows.map((rowLetter) => {
                  const rowSeats = tierSeats.filter((s) => s.row === rowLetter);

                  return (
                    <div key={rowLetter} className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {/* Row Label Left */}
                      <span className="w-5 text-center text-xs font-bold text-neutral-300 font-mono">
                        {rowLetter}
                      </span>

                      {/* Seats in row */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {rowSeats.map((seat, index) => {
                          const isSelected = selectedSeatIds.includes(seat.id);
                          const isSold = seat.isBooked;

                          // Insert middle aisle gap
                          const hasAisleGap = index === Math.floor(rowSeats.length / 2);

                          return (
                            <React.Fragment key={seat.id}>
                              {hasAisleGap && <div className="w-4 sm:w-8" />}
                              <button
                                type="button"
                                disabled={isSold}
                                onClick={() => onToggleSeat(seat)}
                                className={`relative flex items-center justify-center rounded transition-all duration-150 text-[10px] font-mono font-medium ${
                                  tier === 'Recliner'
                                    ? 'h-7 w-7 sm:h-8 sm:w-8 rounded-lg'
                                    : 'h-6 w-6 sm:h-7 sm:w-7'
                                } ${
                                  isSold
                                    ? 'bg-neutral-800/60 text-neutral-600 cursor-not-allowed border border-transparent'
                                    : isSelected
                                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 ring-2 ring-rose-400 scale-105'
                                    : 'bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:border-rose-500 hover:text-white hover:bg-neutral-800'
                                }`}
                                title={
                                  isSold
                                    ? `Seat ${seat.id} (Sold)`
                                    : `Seat ${seat.id} (${tier} - ₹${seat.price})`
                                }
                              >
                                {seat.number}
                              </button>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Row Label Right */}
                      <span className="w-5 text-center text-xs font-bold text-neutral-300 font-mono">
                        {rowLetter}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend & Seat Info */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-neutral-800 bg-neutral-950/60 px-6 py-3 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-neutral-700 bg-neutral-900" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-rose-600 ring-1 ring-rose-400" />
          <span className="text-white font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-neutral-800/80 border border-neutral-800" />
          <span className="text-neutral-400">Sold / Reserved</span>
        </div>
      </div>
    </div>
  );
};
