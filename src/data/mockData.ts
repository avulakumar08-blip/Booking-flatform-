import { Movie, Train, Bus, SnackCombo, ConfirmedTicket, CinemaSeat, BusSeat } from '../types/booking';

export const CITIES = [
  'Mumbai',
  'Delhi-NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Goa',
  'Jaipur',
];

export const SNACK_COMBOS: SnackCombo[] = [
  {
    id: 'snack-1',
    name: 'Jumbo Caramel Popcorn + Pepsi',
    description: 'Freshly popped salted caramel corn (180g) with 650ml chilled beverage.',
    price: 380,
    category: 'Combos',
    quantity: 0,
  },
  {
    id: 'snack-2',
    name: 'Cheese Nachos & Salsa Trio',
    description: 'Crisp tortilla crisps served with warm Monterey Jack cheese dip & zesty salsa.',
    price: 290,
    category: 'Bites',
    quantity: 0,
  },
  {
    id: 'snack-3',
    name: 'Gourmet Truffle & Butter Tub',
    description: 'Signature warm movie tub popped in pure butter infused with black truffle seasoning.',
    price: 340,
    category: 'Popcorn',
    quantity: 0,
  },
  {
    id: 'snack-4',
    name: 'Artisanal Cold Brew Coffee',
    description: 'Slow-steeped Arabica cold coffee served chilled over ice (400ml).',
    price: 210,
    category: 'Beverages',
    quantity: 0,
  },
];

export const generateCinemaSeats = (): CinemaSeat[] => {
  const seats: CinemaSeat[] = [];
  const rows = [
    { row: 'A', tier: 'Recliner', price: 450, count: 8 },
    { row: 'B', tier: 'Recliner', price: 450, count: 8 },
    { row: 'C', tier: 'Prime', price: 290, count: 12 },
    { row: 'D', tier: 'Prime', price: 290, count: 12 },
    { row: 'E', tier: 'Prime', price: 290, count: 12 },
    { row: 'F', tier: 'Classic', price: 190, count: 14 },
    { row: 'G', tier: 'Classic', price: 190, count: 14 },
    { row: 'H', tier: 'Classic', price: 190, count: 14 },
  ] as const;

  rows.forEach(({ row, tier, price, count }) => {
    for (let i = 1; i <= count; i++) {
      // Deterministically set some pre-booked seats
      const isBooked = (row === 'B' && (i === 3 || i === 4)) ||
                       (row === 'D' && (i === 5 || i === 6 || i === 7)) ||
                       (row === 'F' && (i === 1 || i === 2 || i === 12));
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        tier,
        price,
        isBooked,
      });
    }
  });

  return seats;
};

export const MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Cosmic Horizon: Odyssey',
    tagline: 'Beyond humanity’s last known boundary lies our singular hope.',
    posterUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    rating: 9.1,
    voteCount: '142.8K',
    certificate: 'U/A 13+',
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    formats: ['IMAX 3D', '3D', '2D', '4DX'],
    duration: '2h 48m',
    genre: ['Sci-Fi', 'Adventure', 'Mystery'],
    releaseDate: 'Fri, 02 Oct 2026',
    synopsis: 'A daring deep-space expedition ventures through an anomalous gravitational rift to decode signals originating from a primordial extraterrestrial construct orbiting a dormant white dwarf.',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Florence Pugh', 'Robert Pattinson', 'Zendaya'],
    accentColor: '#3B82F6',
    theaters: [
      {
        id: 'th-1',
        name: 'PVR INOX Superplex: Palladium Mall',
        location: 'High Street Phoenix, Lower Parel',
        distance: '2.4 km away',
        cancellationAllowed: true,
        foodBeverageAvailable: true,
        showtimes: [
          { id: 'st-1', time: '10:30 AM', format: 'IMAX 3D', priceMultiplier: 1.25, screenName: 'IMAX Screen 1' },
          { id: 'st-2', time: '02:15 PM', format: 'IMAX 3D', priceMultiplier: 1.25, screenName: 'IMAX Screen 1' },
          { id: 'st-3', time: '06:00 PM', format: 'IMAX 3D', priceMultiplier: 1.35, screenName: 'IMAX Screen 1' },
          { id: 'st-4', time: '09:45 PM', format: '4DX', priceMultiplier: 1.4, screenName: '4DX Dynamic Hall' },
        ],
      },
      {
        id: 'th-2',
        name: 'Cinepolis VIP Luxury Cinema',
        location: 'Viviana Mall, Eastern Express Highway',
        distance: '5.1 km away',
        cancellationAllowed: true,
        foodBeverageAvailable: true,
        showtimes: [
          { id: 'st-5', time: '11:00 AM', format: '3D', priceMultiplier: 1.1, screenName: 'Audi 3 VIP' },
          { id: 'st-6', time: '03:30 PM', format: '2D', priceMultiplier: 1.0, screenName: 'Audi 4 Gold' },
          { id: 'st-7', time: '07:15 PM', format: '3D', priceMultiplier: 1.2, screenName: 'Audi 3 VIP' },
          { id: 'st-8', time: '10:45 PM', format: '2D', priceMultiplier: 1.0, screenName: 'Audi 2' },
        ],
      },
      {
        id: 'th-3',
        name: 'Miraj Cinemas: Premier City Center',
        location: 'Grand Central Plaza, Sector 40',
        distance: '6.8 km away',
        cancellationAllowed: false,
        foodBeverageAvailable: true,
        showtimes: [
          { id: 'st-9', time: '01:00 PM', format: '2D', priceMultiplier: 0.95, screenName: 'Screen 2' },
          { id: 'st-10', time: '04:45 PM', format: '2D', priceMultiplier: 0.95, screenName: 'Screen 2' },
          { id: 'st-11', time: '08:30 PM', format: '2D', priceMultiplier: 1.05, screenName: 'Screen 1 Atmos' },
        ],
      },
    ],
  },
  {
    id: 'mov-2',
    title: 'Shadow Cipher: Zero Hour',
    tagline: 'When every frequency is monitored, silence is the deadliest weapon.',
    posterUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    rating: 8.7,
    voteCount: '98.4K',
    certificate: 'A',
    languages: ['Hindi', 'English', 'Tamil'],
    formats: ['2D', '4DX', 'IMAX 3D'],
    duration: '2h 24m',
    genre: ['Action', 'Thriller', 'Espionage'],
    releaseDate: 'Thu, 24 Sep 2026',
    synopsis: 'An unsanctioned cyber-intelligence operative infiltrates a rogue syndicate weaponizing autonomous satellite grids before an engineered global communications blackout.',
    director: 'Denis Villeneuve',
    cast: ['Hrithik Roshan', 'Deepika Padukone', 'Michael Fassbender'],
    accentColor: '#E11D48',
    theaters: [
      {
        id: 'th-4',
        name: 'PVR INOX Superplex: Palladium Mall',
        location: 'High Street Phoenix, Lower Parel',
        distance: '2.4 km away',
        cancellationAllowed: true,
        foodBeverageAvailable: true,
        showtimes: [
          { id: 'st-12', time: '11:45 AM', format: '2D', priceMultiplier: 1.0, screenName: 'Audi 4' },
          { id: 'st-13', time: '04:00 PM', format: '4DX', priceMultiplier: 1.35, screenName: '4DX Dynamic Hall' },
          { id: 'st-14', time: '08:15 PM', format: 'IMAX 3D', priceMultiplier: 1.3, screenName: 'IMAX Screen 1' },
        ],
      },
      {
        id: 'th-5',
        name: 'Cinepolis VIP Luxury Cinema',
        location: 'Viviana Mall, Eastern Express Highway',
        distance: '5.1 km away',
        cancellationAllowed: true,
        foodBeverageAvailable: true,
        showtimes: [
          { id: 'st-15', time: '01:30 PM', format: '2D', priceMultiplier: 1.0, screenName: 'Audi 2' },
          { id: 'st-16', time: '05:45 PM', format: '2D', priceMultiplier: 1.1, screenName: 'Audi 2' },
          { id: 'st-17', time: '09:30 PM', format: '2D', priceMultiplier: 1.15, screenName: 'Audi 4 Gold' },
        ],
      },
    ],
  },
  {
    id: 'mov-3',
    title: 'The Silent Citadel',
    tagline: 'Some ancient secrets demand retribution.',
    posterUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    rating: 8.5,
    voteCount: '64.2K',
    certificate: 'U/A 16+',
    languages: ['Hindi', 'Tamil', 'Telugu', 'Kannada'],
    formats: ['2D', '3D'],
    duration: '2h 36m',
    genre: ['Historical', 'Drama', 'War'],
    releaseDate: 'Fri, 18 Sep 2026',
    synopsis: 'A forgotten mountain garrison holds the line during a 40-day siege against an invading empire, defending the realm’s sacred archives.',
    director: 'S.S. Rajamouli',
    cast: ['Prabhas', 'Ram Charan', 'Anushka Shetty'],
    accentColor: '#D97706',
    theaters: [
      {
        id: 'th-6',
        name: 'PVR INOX Superplex: Palladium Mall',
        location: 'High Street Phoenix, Lower Parel',
        distance: '2.4 km away',
        cancellationAllowed: true,
        foodBeverageAvailable: true,
        showtimes: [
          { id: 'st-18', time: '12:00 PM', format: '3D', priceMultiplier: 1.1, screenName: 'Audi 5 Atmos' },
          { id: 'st-19', time: '03:45 PM', format: '3D', priceMultiplier: 1.1, screenName: 'Audi 5 Atmos' },
          { id: 'st-20', time: '07:30 PM', format: '3D', priceMultiplier: 1.25, screenName: 'Audi 5 Atmos' },
        ],
      },
    ],
  },
  {
    id: 'mov-4',
    title: 'Neon Mirage 2099',
    tagline: 'Real memory is the rarest black market commodity.',
    posterUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    backdropUrl: '/src/assets/images/hero_cinema_banner_1790575077341.jpg',
    rating: 8.9,
    voteCount: '112.5K',
    certificate: 'A',
    languages: ['English', 'Hindi'],
    formats: ['IMAX 3D', '2D'],
    duration: '2h 15m',
    genre: ['Cyberpunk', 'Action', 'Neo-Noir'],
    releaseDate: 'Fri, 25 Sep 2026',
    synopsis: 'In a rain-drenched subterranean megacity, a memory extractor uncovers an anomaly implanted into an influential diplomat’s neural core.',
    director: 'Ridley Scott',
    cast: ['Pedro Pascal', 'Ana de Armas', 'Oscar Isaac'],
    accentColor: '#8B5CF6',
    theaters: [
      {
        id: 'th-7',
        name: 'Cinepolis VIP Luxury Cinema',
        location: 'Viviana Mall, Eastern Express Highway',
        distance: '5.1 km away',
        cancellationAllowed: true,
        foodBeverageAvailable: true,
        showtimes: [
          { id: 'st-21', time: '02:00 PM', format: 'IMAX 3D', priceMultiplier: 1.3, screenName: 'Audi 3 VIP' },
          { id: 'st-22', time: '06:15 PM', format: 'IMAX 3D', priceMultiplier: 1.35, screenName: 'Audi 3 VIP' },
          { id: 'st-23', time: '10:00 PM', format: '2D', priceMultiplier: 1.0, screenName: 'Audi 4 Gold' },
        ],
      },
    ],
  },
];

export const TRAINS: Train[] = [
  {
    id: 'trn-1',
    number: '12952',
    name: 'New Delhi - Mumbai Central Tejas Rajdhani Express',
    fromStation: 'New Delhi',
    fromCode: 'NDLS',
    toStation: 'Mumbai Central',
    toCode: 'MMCT',
    departureTime: '16:55',
    arrivalTime: '08:35',
    duration: '15h 40m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    foodProvided: true,
    classes: [
      { code: '1A', name: 'AC First Class', price: 4320, availableSeats: 14, statusText: 'AVAILABLE-14', statusType: 'available' },
      { code: '2A', name: 'AC 2 Tier', price: 2840, availableSeats: 38, statusText: 'AVAILABLE-38', statusType: 'available' },
      { code: '3A', name: 'AC 3 Tier', price: 2010, availableSeats: 64, statusText: 'AVAILABLE-64', statusType: 'available' },
    ],
    routeStops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: 'Source', departureTime: '16:55', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '21:30', departureTime: '21:40', haltMinutes: 10, distanceKm: 465, day: 1 },
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '03:40', departureTime: '03:50', haltMinutes: 10, distanceKm: 992, day: 2 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '05:13', departureTime: '05:18', haltMinutes: 5, distanceKm: 1122, day: 2 },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '08:35', departureTime: 'Destination', haltMinutes: 0, distanceKm: 1384, day: 2 },
    ],
  },
  {
    id: 'trn-2',
    number: '20902',
    name: 'Vande Bharat Express',
    fromStation: 'Mumbai Central',
    fromCode: 'MMCT',
    toStation: 'Gandhinagar Capital',
    toCode: 'GNC',
    departureTime: '06:00',
    arrivalTime: '12:25',
    duration: '06h 25m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    foodProvided: true,
    classes: [
      { code: 'CC', name: 'AC Chair Car', price: 1420, availableSeats: 52, statusText: 'AVAILABLE-52', statusType: 'available' },
      { code: '1A', name: 'Executive Chair Car', price: 2630, availableSeats: 18, statusText: 'AVAILABLE-18', statusType: 'available' },
    ],
    routeStops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: 'Source', departureTime: '06:00', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'BVI', stationName: 'Borivali', arrivalTime: '06:23', departureTime: '06:25', haltMinutes: 2, distanceKm: 30, day: 1 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '08:37', departureTime: '08:40', haltMinutes: 3, distanceKm: 263, day: 1 },
      { stationCode: 'ADI', stationName: 'Ahmedabad Junction', arrivalTime: '11:25', departureTime: '11:30', haltMinutes: 5, distanceKm: 491, day: 1 },
      { stationCode: 'GNC', stationName: 'Gandhinagar Capital', arrivalTime: '12:25', departureTime: 'Destination', haltMinutes: 0, distanceKm: 522, day: 1 },
    ],
  },
  {
    id: 'trn-3',
    number: '12007',
    name: 'Mysuru - Chennai Central Shatabdi Express',
    fromStation: 'KSR Bengaluru',
    fromCode: 'SBC',
    toStation: 'MGR Chennai Central',
    toCode: 'MAS',
    departureTime: '11:00',
    arrivalTime: '15:50',
    duration: '04h 50m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    foodProvided: true,
    classes: [
      { code: 'CC', name: 'AC Chair Car', price: 1010, availableSeats: 74, statusText: 'AVAILABLE-74', statusType: 'available' },
      { code: '1A', name: 'Executive Class', price: 1980, availableSeats: 8, statusText: 'AVAILABLE-08', statusType: 'available' },
    ],
    routeStops: [
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: 'Source', departureTime: '11:00', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'KJM', stationName: 'Krishnarajapuram', arrivalTime: '11:20', departureTime: '11:22', haltMinutes: 2, distanceKm: 14, day: 1 },
      { stationCode: 'KPD', stationName: 'Katpadi Junction', arrivalTime: '13:58', departureTime: '14:00', haltMinutes: 2, distanceKm: 228, day: 1 },
      { stationCode: 'MAS', stationName: 'MGR Chennai Central', arrivalTime: '15:50', departureTime: 'Destination', haltMinutes: 0, distanceKm: 358, day: 1 },
    ],
  },
  {
    id: 'trn-4',
    number: '12728',
    name: 'Godavari Superfast Express',
    fromStation: 'Hyderabad Deccan',
    fromCode: 'HYB',
    toStation: 'Visakhapatnam',
    toCode: 'VSKP',
    departureTime: '17:05',
    arrivalTime: '05:45',
    duration: '12h 40m',
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    foodProvided: false,
    classes: [
      { code: '1A', name: 'AC First Class', price: 3120, availableSeats: 6, statusText: 'AVAILABLE-06', statusType: 'available' },
      { code: '2A', name: 'AC 2 Tier', price: 1840, availableSeats: 22, statusText: 'AVAILABLE-22', statusType: 'available' },
      { code: '3A', name: 'AC 3 Tier', price: 1320, availableSeats: 48, statusText: 'AVAILABLE-48', statusType: 'available' },
      { code: 'SL', name: 'Sleeper Class', price: 495, availableSeats: 85, statusText: 'AVAILABLE-85', statusType: 'available' },
    ],
    routeStops: [
      { stationCode: 'HYB', stationName: 'Hyderabad Deccan', arrivalTime: 'Source', departureTime: '17:05', haltMinutes: 0, distanceKm: 0, day: 1 },
      { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '17:25', departureTime: '17:30', haltMinutes: 5, distanceKm: 10, day: 1 },
      { stationCode: 'BZA', stationName: 'Vijayawada Junction', arrivalTime: '23:30', departureTime: '23:45', haltMinutes: 15, distanceKm: 349, day: 1 },
      { stationCode: 'VSKP', stationName: 'Visakhapatnam', arrivalTime: '05:45', departureTime: 'Destination', haltMinutes: 0, distanceKm: 708, day: 2 },
    ],
  },
];

export const generateBusSeats = (basePrice: number): BusSeat[] => {
  const seats: BusSeat[] = [];

  // Lower Deck: 12 sleeper / seater berths
  for (let i = 1; i <= 15; i++) {
    const isBooked = i === 2 || i === 5 || i === 8 || i === 11;
    const isFemaleBooked = i === 5;
    const isWindow = i % 3 === 1 || i % 3 === 0;
    seats.push({
      id: `L-${i}`,
      seatNumber: `L${i}`,
      deck: 'lower',
      type: 'sleeper',
      position: isWindow ? 'window' : 'aisle',
      price: basePrice,
      isBooked,
      isFemaleBooked,
    });
  }

  // Upper Deck: 15 berths
  for (let i = 1; i <= 15; i++) {
    const isBooked = i === 3 || i === 7 || i === 9 || i === 14;
    const isFemaleBooked = i === 9;
    const isWindow = i % 3 === 1 || i % 3 === 0;
    seats.push({
      id: `U-${i}`,
      seatNumber: `U${i}`,
      deck: 'upper',
      type: 'sleeper',
      position: isWindow ? 'window' : 'aisle',
      price: basePrice + 120, // Upper deck premium
      isBooked,
      isFemaleBooked,
    });
  }

  return seats;
};

export const BUSES: Bus[] = [
  {
    id: 'bus-1',
    operator: 'Zingbus Maxx Premium',
    busType: 'Volvo 9600 Multi-Axle A/C Sleeper (2+1)',
    hasAC: true,
    hasSleeper: true,
    departureTime: '20:30',
    arrivalTime: '06:45',
    duration: '10h 15m',
    fromCity: 'Mumbai',
    toCity: 'Goa',
    rating: 4.8,
    reviewCount: 2340,
    startingPrice: 1290,
    seatsAvailable: 22,
    amenities: ['Live Tracking', 'Blanket & Pillow', 'Charging Point', 'Reading Light', 'Emergency SOS'],
    boardingPoints: [
      { id: 'bp-1', location: 'Borivali West (Gokul Hotel)', time: '20:30', landmark: 'Near Shimpoli signal' },
      { id: 'bp-2', location: 'Andheri East (Bisleri Flyover)', time: '21:15', landmark: 'Western Express Highway' },
      { id: 'bp-3', location: 'Vashi (Old Toll Naka)', time: '22:30', landmark: 'Below Flyover' },
    ],
    droppingPoints: [
      { id: 'dp-1', location: 'Mapusa Bus Stand', time: '05:45', landmark: 'Opposite Police Station' },
      { id: 'dp-2', location: 'Panjim (Patto Plaza)', time: '06:15', landmark: 'Near KTC Bus Terminus' },
      { id: 'dp-3', location: 'Madgaon (KTC Bus Stand)', time: '06:45', landmark: 'Main Gate' },
    ],
    seats: generateBusSeats(1290),
  },
  {
    id: 'bus-2',
    operator: 'IntrCity SmartBus Platinum Lounge',
    busType: 'Scania Multi-Axle AC Sleeper with Washroom',
    hasAC: true,
    hasSleeper: true,
    departureTime: '21:45',
    arrivalTime: '07:30',
    duration: '09h 45m',
    fromCity: 'Bengaluru',
    toCity: 'Hyderabad',
    rating: 4.9,
    reviewCount: 3890,
    startingPrice: 1450,
    seatsAvailable: 18,
    amenities: ['Onboard Restroom', 'Wi-Fi 5G', 'Mineral Water', 'SmartBus Captain', 'CCTV Security'],
    boardingPoints: [
      { id: 'bp-4', location: 'Majestic (Sangam Cinema)', time: '21:45', landmark: 'Opp Metro Pillar 42' },
      { id: 'bp-5', location: 'Hebbal (Esteem Mall)', time: '22:30', landmark: 'Service Road' },
    ],
    droppingPoints: [
      { id: 'dp-4', location: 'Aramghar X Road', time: '06:45', landmark: 'National Highway 44' },
      { id: 'dp-5', location: 'Gachibowli (ORR Circle)', time: '07:30', landmark: 'Near Bio-Diversity Park' },
    ],
    seats: generateBusSeats(1450),
  },
  {
    id: 'bus-3',
    operator: 'Orange Travels Royal Class',
    busType: 'Mercedes-Benz Super High Deck AC Sleeper (2+1)',
    hasAC: true,
    hasSleeper: true,
    departureTime: '22:15',
    arrivalTime: '08:00',
    duration: '09h 45m',
    fromCity: 'Delhi-NCR',
    toCity: 'Jaipur',
    rating: 4.7,
    reviewCount: 1650,
    startingPrice: 890,
    seatsAvailable: 24,
    amenities: ['Clean Linen', 'Personal 10" TV Screen', 'USB-C Ports', 'Water Bottle'],
    boardingPoints: [
      { id: 'bp-6', location: 'Kashmere Gate (ISBT Gate 1)', time: '22:15', landmark: 'Opposite Metro Station' },
      { id: 'bp-7', location: 'Dhaula Kuan (Flyover End)', time: '23:00', landmark: 'Ring Road' },
    ],
    droppingPoints: [
      { id: 'dp-6', location: 'Sindhi Camp (Bus Stand)', time: '07:15', landmark: 'Station Road' },
      { id: 'dp-7', location: 'Narayan Singh Circle', time: '08:00', landmark: 'Near Police Memorial' },
    ],
    seats: generateBusSeats(890),
  },
  {
    id: 'bus-4',
    operator: 'VRL Travels Executive',
    busType: 'Isuzu AC Semi-Sleeper Luxury Coach',
    hasAC: true,
    hasSleeper: false,
    departureTime: '23:30',
    arrivalTime: '05:30',
    duration: '06h 00m',
    fromCity: 'Pune',
    toCity: 'Mumbai',
    rating: 4.6,
    reviewCount: 4210,
    startingPrice: 650,
    seatsAvailable: 28,
    amenities: ['Reclining Push-Back Seats', 'Air Suspension', 'Charging Ports', 'Newspaper'],
    boardingPoints: [
      { id: 'bp-8', location: 'Swargate (VRL Office)', time: '23:30', landmark: 'Near Laxmi Narayan Theater' },
      { id: 'bp-9', location: 'Wakad (Hinjawadi Flyover)', time: '00:15', landmark: 'Expressway Entry Point' },
    ],
    droppingPoints: [
      { id: 'dp-8', location: 'Dadar TT Circle', time: '05:00', landmark: 'Near Swami Narayan Temple' },
      { id: 'dp-9', location: 'Borivali West', time: '05:30', landmark: 'Gokul Hotel' },
    ],
    seats: generateBusSeats(650),
  },
];

export const INITIAL_CONFIRMED_TICKETS: ConfirmedTicket[] = [
  {
    id: 'BKG-984210',
    pnr: 'IR-78429183',
    category: 'trains',
    title: 'New Delhi - Mumbai Central Tejas Rajdhani Express',
    subtitle: 'Train #12952 · AC 2 Tier (2A)',
    bookingTimestamp: 'Today, 09:15 AM',
    journeyDate: 'Tomorrow, 28 Sep 2026',
    time: '16:55 Departure · 08:35 Arrival (+1 Day)',
    locationOrRoute: 'New Delhi (NDLS) → Mumbai Central (MMCT)',
    seatSummary: 'Coach A2 · Berths 21 (LB), 22 (MB)',
    seatNumbers: ['A2-21', 'A2-22'],
    passengerSummary: '2 Adult Passengers',
    passengers: [
      { name: 'Kumar Sharma', details: 'Age 34 · Male · Lower Berth' },
      { name: 'Ananya Sharma', details: 'Age 31 · Female · Middle Berth' },
    ],
    baseAmount: 5680,
    taxAndFees: 240,
    discount: 100,
    totalAmount: 5820,
    status: 'CONFIRMED',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=IR-78429183-TRAIN-CONFIRMED',
    barcodeNumber: '84920491823901',
    extraDetails: {
      'Coach': 'A2',
      'Quota': 'General',
      'Catering': 'Included (Dinner & Morning Tea)',
      'Platform Est.': 'Platform 2 (NDLS)',
    },
  },
];
