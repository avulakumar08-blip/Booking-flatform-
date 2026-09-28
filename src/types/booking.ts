export type BookingCategory = 'movies' | 'trains' | 'buses' | 'my-bookings';

export interface CinemaShowtime {
  id: string;
  time: string;
  format: '2D' | '3D' | 'IMAX 3D' | '4DX';
  priceMultiplier: number;
  screenName: string;
}

export interface CinemaTheater {
  id: string;
  name: string;
  location: string;
  distance: string;
  cancellationAllowed: boolean;
  foodBeverageAvailable: boolean;
  showtimes: CinemaShowtime[];
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  voteCount: string;
  certificate: 'U/A 13+' | 'U/A 16+' | 'A' | 'U';
  languages: string[];
  formats: ('2D' | '3D' | 'IMAX 3D' | '4DX')[];
  duration: string;
  genre: string[];
  releaseDate: string;
  synopsis: string;
  director: string;
  cast: string[];
  accentColor: string;
  theaters: CinemaTheater[];
}

export interface CinemaSeat {
  id: string;
  row: string;
  number: number;
  tier: 'Recliner' | 'Prime' | 'Classic';
  price: number;
  isBooked: boolean;
  isSelected?: boolean;
}

export interface SnackCombo {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Popcorn' | 'Combos' | 'Beverages' | 'Bites';
  quantity: number;
}

export interface TrainClassOption {
  code: '1A' | '2A' | '3A' | 'SL' | 'CC';
  name: string;
  price: number;
  availableSeats: number;
  statusText: string;
  statusType: 'available' | 'rac' | 'wl';
}

export interface TrainSchedule {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  fromStation: string;
  fromCode: string;
  toStation: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  classes: TrainClassOption[];
  foodProvided: boolean;
  routeStops: TrainSchedule[];
}

export interface TrainPassenger {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  berthPreference: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'No Preference';
}

export interface BusSeat {
  id: string;
  seatNumber: string;
  deck: 'lower' | 'upper';
  type: 'seater' | 'sleeper';
  position: 'window' | 'aisle' | 'single';
  price: number;
  isBooked: boolean;
  isFemaleBooked?: boolean;
  isSelected?: boolean;
}

export interface BusBoardingPoint {
  id: string;
  location: string;
  time: string;
  landmark: string;
}

export interface Bus {
  id: string;
  operator: string;
  busType: string;
  hasAC: boolean;
  hasSleeper: boolean;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromCity: string;
  toCity: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  seatsAvailable: number;
  amenities: string[];
  boardingPoints: BusBoardingPoint[];
  droppingPoints: BusBoardingPoint[];
  seats: BusSeat[];
}

export interface ConfirmedTicket {
  id: string;
  pnr: string;
  category: 'movies' | 'trains' | 'buses';
  title: string;
  subtitle: string;
  bookingTimestamp: string;
  journeyDate: string;
  time: string;
  locationOrRoute: string;
  seatSummary: string;
  seatNumbers: string[];
  passengerSummary: string;
  passengers: Array<{
    name: string;
    details: string;
  }>;
  baseAmount: number;
  taxAndFees: number;
  discount: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'CANCELLED';
  qrCodeUrl: string;
  barcodeNumber: string;
  extraDetails: { [key: string]: string };
}
