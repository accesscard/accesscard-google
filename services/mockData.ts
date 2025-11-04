
import { Plan, User, Venue, Reservation, PlanLevel, Notification, PaymentRecord } from '../types';
import { Country } from '../components/CountrySelector';

export const PLANS: Record<PlanLevel, Plan> = {
  [PlanLevel.Silver]: {
    level: PlanLevel.Silver,
    name: 'Silver Access',
    price: 49,
    features: ['Acceso a eventos seleccionados', 'Descuentos del 10%', 'Soporte estándar'],
    color: 'bg-gray-500',
    gradient: 'from-gray-600 to-gray-800'
  },
  [PlanLevel.Gold]: {
    level: PlanLevel.Gold,
    name: 'Gold Access',
    price: 99,
    features: ['Acceso prioritario', 'Bebida de bienvenida', 'Reservas garantizadas', 'Soporte prioritario'],
    color: 'bg-yellow-500',
    gradient: 'from-amber-400 to-yellow-600'
  },
  [PlanLevel.Black]: {
    level: PlanLevel.Black,
    name: 'Black Access',
    price: 199,
    features: ['Acceso VIP total', 'Concierge personal', 'Eventos exclusivos Black', 'Upgrades de cortesía'],
    color: 'bg-black',
    gradient: 'from-amber-500 to-black'
  }
};

const MOCK_PAYMENT_HISTORY: PaymentRecord[] = [
    { id: 'pay_1', date: '2024-06-01', amount: 99, plan: 'Gold Access', invoiceId: 'INV-2024-001' },
    { id: 'pay_2', date: '2024-05-01', amount: 99, plan: 'Gold Access', invoiceId: 'INV-2024-002' },
    { id: 'pay_3', date: '2024-04-01', amount: 49, plan: 'Silver Access', invoiceId: 'INV-2024-003' },
];

export const MOCK_ADMIN_USER: User = {
  id: 'admin_001',
  name: "Miguel Viejo",
  email: "mviejo@agenciagrow.cl",
  password: "rnta2014",
  plan: PLANS[PlanLevel.Black],
  memberSince: 'Fundador',
  cardStatus: 'activa',
  qrCodeValue: 'ACCESS+ADMIN001-BLACK',
  role: 'admin',
  membershipExpires: 'N/A',
  country: 'Chile',
  phone: '+56911112222',
};

export const MOCK_USER: User = {
  id: 'usr_12345',
  name: "Carlos Santana",
  email: "carlos.santana@email.com",
  password: "password",
  plan: PLANS[PlanLevel.Gold],
  memberSince: 'Enero 2023',
  membershipExpires: '2025-07-31',
  cardStatus: 'activa',
  qrCodeValue: 'ACCESS+USR12345-GOLD',
  role: 'user',
  country: 'Perú',
  address: 'Av. Larco 123, Miraflores, Lima',
  phone: '+51987654321',
  socialMedia: '@carlossantana',
  paymentHistory: MOCK_PAYMENT_HISTORY
};

const chileVenues: Venue[] = [
  {
    id: 'cl_venue_1',
    name: 'Boragó',
    category: 'Restaurante',
    location: 'Vitacura, Santiago',
    address: 'Av. San Josemaría Escrivá de Balaguer 5970, Vitacura',
    image: 'https://picsum.photos/seed/borago/400/400',
    rating: 4.9,
    benefits: [
      { description: 'Acceso a mesa del chef', planRequired: PlanLevel.Black },
      { description: 'Copa de espumante de bienvenida', planRequired: PlanLevel.Gold }
    ],
    description: 'Reconocido mundialmente por su cocina endémica, Boragó ofrece un viaje culinario único por el territorio chileno.',
    coordinates: { lat: -33.3909, lng: -70.5658 },
    status: 'aprobado',
    contact: { email: 'contacto@borago.cl', phone: '+56229538869' }
  },
  {
    id: 'cl_venue_2',
    name: 'Tramonto Bar & Terrace',
    category: 'Rooftop',
    location: 'Las Condes, Santiago',
    address: 'Av. Kennedy 4700, Vitacura, Santiago',
    image: 'https://picsum.photos/seed/tramonto/400/400',
    rating: 4.8,
    benefits: [
      { description: 'Acceso sin fila', planRequired: PlanLevel.Gold },
      { description: 'Cocktail de autor de cortesía', planRequired: PlanLevel.Black }
    ],
    description: 'Ubicado en el piso 17, ofrece vistas espectaculares de la cordillera y una coctelería de primer nivel.',
    coordinates: { lat: -33.4093, lng: -70.5735 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_3',
    name: 'Club La Feria',
    category: 'Discoteca',
    location: 'Bellavista, Santiago',
    address: 'Constitución 275, Providencia, Santiago',
    image: 'https://picsum.photos/seed/laferia/400/400',
    rating: 4.7,
    benefits: [
      { description: 'Cover de cortesía', planRequired: PlanLevel.Silver },
      { description: 'Acceso a zona VIP', planRequired: PlanLevel.Black }
    ],
    description: 'El templo de la música electrónica en Chile, con un sistema de sonido Funktion-One y DJs de talla mundial.',
    coordinates: { lat: -33.4316, lng: -70.6323 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_4',
    name: 'Bocanáriz',
    category: 'Bar',
    location: 'Lastarria, Santiago',
    address: 'José Victorino Lastarria 276, Santiago',
    image: 'https://picsum.photos/seed/bocanariz/400/400',
    rating: 4.9,
    benefits: [
      { description: 'Degustación de vino premium', planRequired: PlanLevel.Gold }
    ],
    description: 'Un paraíso para los amantes del vino, con más de 400 etiquetas chilenas y una gastronomía que marida a la perfección.',
    coordinates: { lat: -33.4395, lng: -70.6368 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_5',
    name: 'Osaka Santiago',
    category: 'Restaurante',
    location: 'Vitacura, Santiago',
    address: 'Av. Nueva Costanera 3969, Vitacura, Santiago',
    image: 'https://picsum.photos/seed/osaka/400/400',
    rating: 4.8,
    benefits: [
      { description: 'Mesa preferencial garantizada', planRequired: PlanLevel.Gold },
      { description: 'Postre de la casa de cortesía', planRequired: PlanLevel.Silver }
    ],
    description: 'Exquisita fusión de la cocina japonesa y peruana en un ambiente sofisticado y moderno. Una experiencia Nikkei inolvidable.',
    coordinates: { lat: -33.3986, lng: -70.5925 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_6',
    name: 'Red2One',
    category: 'Rooftop',
    location: 'Las Condes, Santiago',
    address: 'Isidora Goyenechea 3000, Las Condes, Santiago',
    image: 'https://picsum.photos/seed/red2one/400/400',
    rating: 4.7,
    benefits: [
      { description: '2x1 en cocktails de autor', planRequired: PlanLevel.Silver },
      { description: 'Acceso a fiestas privadas', planRequired: PlanLevel.Black }
    ],
    description: 'En el piso 21 del W Santiago, este rooftop es sinónimo de exclusividad, buena música y vistas panorámicas.',
    coordinates: { lat: -33.4093, lng: -70.5740 },
    status: 'aprobado',
  },
   {
    id: 'cl_venue_7',
    name: 'Sarita Colonia',
    category: 'Bar',
    location: 'Bellavista, Santiago',
    address: 'Loreto 40, Recoleta, Santiago',
    image: 'https://picsum.photos/seed/sarita/400/400',
    rating: 4.6,
    benefits: [
        { description: 'Trago de bienvenida', planRequired: PlanLevel.Gold },
    ],
    description: 'Cocina peruana travesti en un espacio kitsch y vibrante. Una experiencia sensorial y teatral única en Santiago.',
    coordinates: { lat: -33.4300, lng: -70.6319 },
    status: 'pendiente',
  },
  {
    id: 'cl_venue_8',
    name: 'Sala Gente',
    category: 'Discoteca',
    location: 'Vitacura, Santiago',
    address: 'Av. Vitacura 4111, Vitacura, Santiago',
    image: 'https://picsum.photos/seed/gente/400/400',
    rating: 4.5,
    benefits: [
        { description: 'Acceso preferencial sin costo', planRequired: PlanLevel.Gold },
        { description: 'Botella de espumante en cumpleaños', planRequired: PlanLevel.Black },
    ],
    description: 'Una de las discotecas más exclusivas de la ciudad, frecuentada por celebridades y un público exigente.',
    coordinates: { lat: -33.3975, lng: -70.5824 },
    status: 'suspendido',
  },
  {
    id: 'cl_venue_9',
    name: 'La Mar Cebichería',
    category: 'Restaurante',
    location: 'Vitacura, Santiago',
    address: 'Av. Nueva Costanera 4076, Vitacura, Santiago',
    image: 'https://picsum.photos/seed/lamar/400/400',
    rating: 4.8,
    benefits: [
        { description: 'Cebiche de degustación', planRequired: PlanLevel.Gold },
        { description: 'Pisco sour de cortesía', planRequired: PlanLevel.Silver },
    ],
    description: 'Del afamado chef Gastón Acurio, es el lugar por excelencia para disfrutar de los mejores cebiches y sabores del mar peruano.',
    coordinates: { lat: -33.4021, lng: -70.5777 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_10',
    name: 'Azotea Matilde',
    category: 'Rooftop',
    location: 'Bellavista, Santiago',
    address: 'Antonia López de Bello 0118, Providencia, Santiago',
    image: 'https://picsum.photos/seed/matilde/400/400',
    rating: 4.6,
    benefits: [
        { description: 'Acceso sin fila', planRequired: PlanLevel.Silver },
    ],
    description: 'Con una vista privilegiada al Cerro San Cristóbal y al skyline de Santiago, es un oasis urbano perfecto para el atardecer.',
    coordinates: { lat: -33.4325, lng: -70.6340 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_11',
    name: 'Bar Liguria',
    category: 'Bar',
    location: 'Lastarria, Santiago',
    address: 'José Victorino Lastarria 19, Santiago',
    image: 'https://picsum.photos/seed/liguria/400/400',
    rating: 4.7,
    benefits: [
        { description: 'Schop de cerveza artesanal de cortesía', planRequired: PlanLevel.Silver },
    ],
    description: 'Un clásico de la bohemia santiaguina. Comida chilena, buenos tragos y una atmósfera inigualable que evoca la historia de la ciudad.',
    coordinates: { lat: -33.4390, lng: -70.6380 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_12',
    name: 'Ambrosía',
    category: 'Restaurante',
    location: 'Vitacura, Santiago',
    address: 'Pamplona 78, Vitacura, Santiago',
    image: 'https://picsum.photos/seed/ambrosia/400/400',
    rating: 4.9,
    benefits: [
        { description: 'Visita a la cocina', planRequired: PlanLevel.Black },
        { description: 'Maridaje de vinos especial', planRequired: PlanLevel.Gold },
    ],
    description: 'Liderado por la chef Carolina Bazán, ofrece una cocina de mercado sofisticada y en constante evolución en un entorno elegante.',
    coordinates: { lat: -33.4050, lng: -70.5800 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_13',
    name: 'Prima Bar',
    category: 'Bar',
    location: 'Lastarria, Santiago',
    address: 'General Flores 228, Providencia, Santiago',
    image: 'https://picsum.photos/seed/prima/400/400',
    rating: 4.8,
    benefits: [
        { description: '20% de descuento en la cuenta final', planRequired: PlanLevel.Gold },
    ],
    description: 'Coctelería de autor y una propuesta gastronómica innovadora lo convierten en uno de los bares más cotizados del barrio.',
    coordinates: { lat: -33.4385, lng: -70.6375 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_14',
    name: '99 Restaurante',
    category: 'Restaurante',
    location: 'Providencia, Santiago',
    address: 'Andrés de Fuenzalida 99, Providencia, Santiago',
    image: 'https://picsum.photos/seed/99rest/400/400',
    rating: 4.8,
    benefits: [
        { description: 'Menú de degustación exclusivo', planRequired: PlanLevel.Black },
    ],
    description: 'Cocina de vanguardia con un menú de degustación que cambia según la temporada, enfocado en el producto chileno.',
    coordinates: { lat: -33.4245, lng: -70.6120 },
    status: 'aprobado',
  },
  {
    id: 'cl_venue_15',
    name: 'Terraza del PISO UNO',
    category: 'Rooftop',
    location: 'Providencia, Santiago',
    address: 'Av. del Parque 498, Huechuraba, Santiago',
    image: 'https://picsum.photos/seed/pisouno/400/400',
    rating: 4.7,
    benefits: [
        { description: 'Acceso prioritario', planRequired: PlanLevel.Gold },
    ],
    description: 'Un espacio elegante con una propuesta gastronómica del premiado chef Renzo Tissinetti y coctelería de clase mundial.',
    coordinates: { lat: -33.4180, lng: -70.6030 },
    status: 'aprobado',
  }
];

const peruVenues: Venue[] = [
  {
    id: 'pe_venue_1',
    name: 'Central Restaurante',
    category: 'Restaurante',
    location: 'Barranco, Lima',
    address: 'Av. Pedro de Osma 301, Barranco, Lima',
    image: 'https://picsum.photos/seed/central/400/400',
    rating: 5.0,
    benefits: [
      { description: 'Acceso a reserva prioritaria', planRequired: PlanLevel.Black },
      { description: 'Copa de vino de bienvenida', planRequired: PlanLevel.Gold }
    ],
    description: 'Considerado el mejor restaurante del mundo, Central ofrece una exploración de los ecosistemas peruanos a través de su menú.',
    coordinates: { lat: -12.1472, lng: -77.0224 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_2',
    name: 'Carnaval Bar',
    category: 'Bar',
    location: 'San Isidro, Lima',
    address: 'Av. Pardo y Aliaga 662, San Isidro, Lima',
    image: 'https://picsum.photos/seed/carnaval/400/400',
    rating: 4.9,
    benefits: [
      { description: 'Cocktail exclusivo fuera de carta', planRequired: PlanLevel.Gold },
      { description: 'Acceso a la barra del bartender', planRequired: PlanLevel.Black }
    ],
    description: 'Una experiencia de coctelería conceptual única, reconocida entre los mejores bares del mundo por su creatividad y técnica.',
    coordinates: { lat: -12.1044, lng: -77.0355 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_3',
    name: 'Celeste Solar Bar',
    category: 'Rooftop',
    location: 'Miraflores, Lima',
    address: 'Jorge Basadre 367, San Isidro, Lima',
    image: 'https://picsum.photos/seed/celeste/400/400',
    rating: 4.7,
    benefits: [
      { description: 'Acceso sin fila', planRequired: PlanLevel.Silver },
      { description: 'Piqueo de cortesía', planRequired: PlanLevel.Gold }
    ],
    description: 'En el Hyatt Centric, este rooftop ofrece una piscina increíble, cocteles refrescantes y una vista panorámica de la ciudad.',
    coordinates: { lat: -12.1192, lng: -77.0305 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_4',
    name: 'Bizarro',
    category: 'Discoteca',
    location: 'Miraflores, Lima',
    address: 'Calle Bellavista 245, Miraflores, Lima',
    image: 'https://picsum.photos/seed/bizarro/400/400',
    rating: 4.6,
    benefits: [
      { description: 'Ingreso gratuito', planRequired: PlanLevel.Gold },
      { description: 'Acceso a zona SuperVIP', planRequired: PlanLevel.Black }
    ],
    description: 'Un ícono de la vida nocturna limeña, con dos ambientes que ofrecen desde rock y pop hasta la mejor música electrónica.',
    coordinates: { lat: -12.1226, lng: -77.0310 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_5',
    name: 'Maido',
    category: 'Restaurante',
    location: 'Miraflores, Lima',
    address: 'Calle San Martin 399, Miraflores, Lima',
    image: 'https://picsum.photos/seed/maido/400/400',
    rating: 5.0,
    benefits: [
      { description: 'Reserva garantizada con 48h de antelación', planRequired: PlanLevel.Black },
      { description: 'Sake de bienvenida', planRequired: PlanLevel.Gold }
    ],
    description: 'La cocina Nikkei llevada a su máxima expresión por el chef Mitsuharu Tsumura. Una fusión perfecta de sabores peruanos y japoneses.',
    coordinates: { lat: -12.1245, lng: -77.0335 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_6',
    name: 'Sastrería Martinez',
    category: 'Bar',
    location: 'Miraflores, Lima',
    address: 'Av. Mariscal La Mar 1269, Miraflores, Lima',
    image: 'https://picsum.photos/seed/martinez/400/400',
    rating: 4.8,
    benefits: [
      { description: 'Acceso a salón oculto', planRequired: PlanLevel.Black },
      { description: '15% de descuento en la cuenta', planRequired: PlanLevel.Gold },
    ],
    description: 'Un bar speakeasy detrás de la fachada de una sastrería, que ofrece cocteles clásicos y de autor en un ambiente íntimo y sofisticado.',
    coordinates: { lat: -12.1211, lng: -77.0362 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_7',
    name: 'Astrid y Gastón',
    category: 'Restaurante',
    location: 'San Isidro, Lima',
    address: 'Av. Paz Soldán 290, San Isidro, Lima',
    image: 'https://picsum.photos/seed/astridygaston/400/400',
    rating: 4.9,
    benefits: [
        { description: 'Tour por la Casa Moreyra', planRequired: PlanLevel.Black },
        { description: 'Postre de autor de cortesía', planRequired: PlanLevel.Gold },
    ],
    description: 'El restaurante que inició la revolución gastronómica peruana. Ubicado en una casona histórica, ofrece una experiencia culinaria inolvidable.',
    coordinates: { lat: -12.1008, lng: -77.0402 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_8',
    name: 'Insumo Rooftop',
    category: 'Rooftop',
    location: 'Miraflores, Lima',
    address: 'Calle Alcanfores 463, Miraflores, Lima',
    image: 'https://picsum.photos/seed/insumo/400/400',
    rating: 4.8,
    benefits: [
        { description: 'Mesa con la mejor vista', planRequired: PlanLevel.Gold },
    ],
    description: 'Cocina de brasas y coctelería de autor con una vista espectacular al Océano Pacífico. Ideal para ver el atardecer.',
    coordinates: { lat: -12.1292, lng: -77.0358 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_9',
    name: 'Gótica',
    category: 'Discoteca',
    location: 'Miraflores, Lima',
    address: 'Malecón de la Reserva 610, Miraflores, Lima',
    image: 'https://picsum.photos/seed/gotica/400/400',
    rating: 4.5,
    benefits: [
        { description: 'Entrada libre + 1 bebida', planRequired: PlanLevel.Gold },
        { description: 'Mesa VIP asegurada', planRequired: PlanLevel.Black },
    ],
    description: 'Ubicada en Larcomar con vista al mar, Gótica es una de las discotecas más exclusivas y con mejor ambiente de Lima.',
    coordinates: { lat: -12.1300, lng: -77.0360 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_10',
    name: 'Kjolle',
    category: 'Restaurante',
    location: 'Barranco, Lima',
    address: 'Av. Pedro de Osma 301, Barranco, Lima',
    image: 'https://picsum.photos/seed/kjolle/400/400',
    rating: 4.9,
    benefits: [
        { description: 'Conversación con la chef Pía León', planRequired: PlanLevel.Black },
    ],
    description: 'La propuesta personal de Pía León (mejor chef femenina del mundo 2021). Una cocina que resalta la biodiversidad peruana con un enfoque femenino.',
    coordinates: { lat: -12.1470, lng: -77.0226 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_11',
    name: 'Lady Bee',
    category: 'Bar',
    location: 'Miraflores, Lima',
    address: 'Av. Ernesto Diez Canseco 329, Miraflores, Lima',
    image: 'https://picsum.photos/seed/ladybee/400/400',
    rating: 4.7,
    benefits: [
        { description: '2x1 en cocteles con Pisco', planRequired: PlanLevel.Silver },
    ],
    description: 'Un bar divertido y relajado con una excelente carta de cocteles que celebran los insumos peruanos. Ambiente vibrante.',
    coordinates: { lat: -12.1215, lng: -77.0290 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_12',
    name: 'Hotel B Rooftop',
    category: 'Rooftop',
    location: 'Barranco, Lima',
    address: 'Jirón Sáenz Peña 204, Barranco, Lima',
    image: 'https://picsum.photos/seed/hotelb/400/400',
    rating: 4.9,
    benefits: [
        { description: 'Acceso exclusivo para miembros', planRequired: PlanLevel.Gold },
    ],
    description: 'El rooftop del hotel más chic de Lima. Un espacio íntimo y elegante para disfrutar de cocteles clásicos y una atmósfera bohemia.',
    coordinates: { lat: -12.1450, lng: -77.0240 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_13',
    name: 'Mayta',
    category: 'Restaurante',
    location: 'Miraflores, Lima',
    address: 'Av. Mariscal La Mar 1285, Miraflores, Lima',
    image: 'https://picsum.photos/seed/mayta/400/400',
    rating: 4.8,
    benefits: [
        { description: 'Cata de piscos premium', planRequired: PlanLevel.Gold },
    ],
    description: 'Del chef Jaime Pesaque, Mayta es una expresión de la cocina peruana contemporánea con un profundo respeto por el producto y la trazabilidad.',
    coordinates: { lat: -12.1260, lng: -77.0320 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_14',
    name: 'Bar Inglés',
    category: 'Bar',
    location: 'San Isidro, Lima',
    address: 'Los Eucaliptos 590, San Isidro, Lima',
    image: 'https://picsum.photos/seed/ingles/400/400',
    rating: 4.8,
    benefits: [
        { description: 'Clase maestra de Pisco Sour', planRequired: PlanLevel.Black },
    ],
    description: 'Ubicado en el Country Club Lima Hotel, es la cuna del Pisco Sour. Un bar legendario con una atmósfera clásica y elegante.',
    coordinates: { lat: -12.0990, lng: -77.0425 },
    status: 'aprobado',
  },
  {
    id: 'pe_venue_15',
    name: '27 Tapas Rooftop',
    category: 'Rooftop',
    location: 'Miraflores, Lima',
    address: 'Calle Independencia 141, Miraflores, Lima',
    image: 'https://picsum.photos/seed/27tapas/400/400',
    rating: 4.6,
    benefits: [
        { description: 'Sangría de cortesía', planRequired: PlanLevel.Silver },
    ],
    description: 'En lo alto del Iberostar Selection, este rooftop ofrece tapas de inspiración española y peruana, con una vista inmejorable al malecón.',
    coordinates: { lat: -12.1285, lng: -77.0365 },
    status: 'aprobado',
  }
];

export const MOCK_VENUE_USER: User = {
  id: 'venue_usr_001',
  name: "Gerente Boragó",
  email: "contacto@borago.cl",
  password: "borago2024",
  plan: null, // N/A for venues
  memberSince: 'Socio Fundador',
  cardStatus: 'activa',
  qrCodeValue: 'VENUE_QR_BORAGO',
  role: 'venue',
  venueId: 'cl_venue_1'
};

export const MOCK_VENUES_BY_COUNTRY: Record<Country, Venue[] | null> = {
  'Chile': chileVenues,
  'Perú': peruVenues,
  'Argentina': null,
  'Colombia': null,
};

// Kept for backwards compatibility with MOCK_RESERVATIONS
export const MOCK_VENUES: Venue[] = [...chileVenues, ...peruVenues];

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res_1',
    venue: chileVenues[1], // Tramonto Bar & Terrace
    date: '2024-07-25T20:00:00Z',
    time: '20:00',
    partySize: 2,
    status: 'confirmada'
  },
  {
    id: 'res_2',
    venue: chileVenues[0], // Boragó
    date: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 days ago
    time: '22:00',
    partySize: 4,
    status: 'completada',
    feedback: {
        rating: 5,
        comment: "¡Una experiencia culinaria que nos cambió la vida!"
    }
  },
  {
    id: 'res_3',
    venue: peruVenues[4], // Maido
    date: new Date(Date.now() - 86400000 * 40).toISOString(), // 40 days ago
    time: '21:00',
    partySize: 2,
    status: 'completada',
  },
  {
    id: 'res_4',
    venue: chileVenues[0], // Boragó
    date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    time: '20:30',
    partySize: 3,
    status: 'pendiente'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    type: 'reservation',
    title: 'Reserva Confirmada',
    message: 'Tu reserva en Tramonto Bar & Terrace para 2 personas ha sido confirmada.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
  },
  {
    id: 'notif_2',
    type: 'offer',
    title: 'Nueva Oferta Black',
    message: 'Boragó ahora ofrece acceso exclusivo a la mesa del chef para miembros Black.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    read: false,
  },
  {
    id: 'notif_3',
    type: 'system',
    title: 'Tu membresía expira pronto',
    message: 'Recuerda renovar tu plan Gold antes del fin de mes para no perder tus beneficios.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: 'notif_4',
    type: 'reservation',
    title: 'Reserva Rechazada',
    message: 'Lamentablemente, Club La Feria no pudo confirmar tu reserva para el Sábado.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    read: true,
  },
];
