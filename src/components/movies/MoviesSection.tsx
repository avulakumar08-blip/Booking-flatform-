import React, { useState, useMemo } from 'react';
import { Search, Star, Film, Ticket, Play, Info } from 'lucide-react';
import { Movie } from '../../types/booking';
import { MOVIES } from '../../data/mockData';

interface MoviesSectionProps {
  onSelectMovie: (movie: Movie) => void;
  selectedCity: string;
}

export const MoviesSection: React.FC<MoviesSectionProps> = ({
  onSelectMovie,
  selectedCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Sci-Fi', 'Action', 'Thriller', 'Drama'];

  const filteredMovies = useMemo(() => {
    return MOVIES.filter((m) => {
      const matchSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.cast.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.director.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGenre = selectedGenre === 'All' || m.genre.includes(selectedGenre);

      return matchSearch && matchGenre;
    });
  }, [searchQuery, selectedGenre]);

  const featuredMovie = MOVIES[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Cinematic Hero Spotlight */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <div className="relative min-h-[380px] sm:min-h-[440px] flex items-end">
          {/* Background Image with measured scrim */}
          <div className="absolute inset-0">
            <img
              src={featuredMovie.backdropUrl}
              alt={featuredMovie.title}
              className="h-full w-full object-cover object-center opacity-45"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/50 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="font-semibold text-rose-500 uppercase tracking-widest">
                Cinema Premiere
              </span>
              <span aria-hidden="true">·</span>
              <span>In Cinemas · {selectedCity}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {featuredMovie.rating}/10
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display text-balance">
              {featuredMovie.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 line-clamp-2 leading-relaxed">
              {featuredMovie.synopsis}
            </p>

            {/* Formats and metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300">
              <span className="font-mono font-medium text-neutral-200">{featuredMovie.duration}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredMovie.genre.join(', ')}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredMovie.formats.join(' / ')}</span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectMovie(featuredMovie)}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <Ticket className="h-4 w-4" />
                <span>Book Tickets</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectMovie(featuredMovie)}
                className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900/80 px-5 py-3 text-sm font-medium text-neutral-200 hover:border-neutral-500 hover:text-white transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>View Showtimes</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search movies, actors, or directors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Filter Tabs (Zero-Pill compliant segmented controls) */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Movies Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white font-display">
            Recommended Movies in {selectedCity}
          </h2>
          <span className="text-xs text-neutral-400 font-mono">
            {filteredMovies.length} Available Shows
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all duration-200 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-xl hover:shadow-rose-950/10"
            >
              {/* Poster Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                {/* Rating Banner on Bottom of Poster */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-neutral-950/80 px-2.5 py-1.5 backdrop-blur-md border border-neutral-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{movie.rating}/10</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {movie.voteCount} votes
                  </span>
                </div>
              </div>

              {/* Movie Meta */}
              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <span>{movie.certificate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{movie.duration}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{movie.genre[0]}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Languages / Formats unboxed text */}
                  <div className="text-[11px] text-neutral-400 truncate">
                    {movie.formats.join(', ')} · {movie.languages.slice(0, 2).join(', ')}
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="button"
                    onClick={() => onSelectMovie(movie)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-neutral-800 py-2.5 text-xs font-semibold text-white group-hover:bg-rose-600 transition-colors"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>Book Tickets</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
