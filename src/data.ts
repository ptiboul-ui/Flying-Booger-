import { Gig, MerchItem, Track } from './types';

export const GIGS_DATA: Gig[] = [
  {
    id: 'gig-1',
    date: 'JULY 14',
    location: 'BERLIN',
    venue: 'SO36',
    soldOut: true,
    price: 25,
  },
  {
    id: 'gig-2',
    date: 'JULY 17',
    location: 'LONDON',
    venue: 'UNDERWORLD',
    soldOut: false,
    lowTickets: true,
    price: 30,
  },
  {
    id: 'gig-3',
    date: 'AUG 02',
    location: 'NEW YORK',
    venue: 'CBGB REBORN',
    soldOut: false,
    price: 35,
  },
  {
    id: 'gig-4',
    date: 'AUG 05',
    location: 'TOKYO',
    venue: 'CLUB QUATTRO',
    soldOut: false,
    price: 40,
  },
  {
    id: 'gig-5',
    date: 'AUG 12',
    location: 'LOS ANGELES',
    venue: 'THE ROXY',
    soldOut: false,
    lowTickets: true,
    price: 32,
  },
  {
    id: 'gig-6',
    date: 'AUG 20',
    location: 'MELBOURNE',
    venue: 'THE TOTE',
    soldOut: false,
    price: 28,
  }
];

export const TRACKS_DATA: Track[] = [
  {
    id: 'track-1',
    title: 'SNOT ROCKET',
    duration: '02:45',
    bpm: 165,
    lyrics: [
      'LAUGHING AT THE RULES, SPINNING OUT OF CONTROL',
      'SNOT ROCKET BLASTING STRAIGHT INTO YOUR SOUL!',
      'STREETS ARE ON FIRE, BOOT ON THE GAS',
      "WE'RE THE PUNKS AND WE'RE MOVING FAST!",
      'SNOT ROCKET! GO! GO! GO!',
      'WIPING OUT THE BORING, TIME TO START THE SHOW!'
    ]
  },
  {
    id: 'track-2',
    title: 'DISTORTION IS MY LOVE LANGUAGE',
    duration: '03:12',
    bpm: 130,
    lyrics: [
      'FEEDBACK SCREAMING IN A CROWDED ROOM',
      'LOVE IS A GUITAR PLAYING NOTES OF DOOM!',
      'CRANK THE VOLTAGE, BLOW THE AMPS ALIGHT',
      'WE ARE COUPLED IN THE PITCH BLACK NIGHT!',
      'DISTORTION! SCREAMING IN MY EAR!',
      "DISTORTION! THAT'S ALL I WANNA HEAR!",
      'YOUR WHISPER IS A DEAFENING ROAR!'
    ]
  },
  {
    id: 'track-3',
    title: 'STAY LOUD OR DIE',
    duration: '02:18',
    bpm: 180,
    lyrics: [
      'SHUT UP AND LISTEN OR STEP ASIDE',
      'WE CAME TO RIOT, NOWHERE TO HIDE!',
      'STAY LOUD OR DIE! STAY LOUD OR DIE!',
      'PUNK IS REVOLUTION, NO TEARS TO CRY!',
      'ONE! TWO! THREE! FOUR! BANG ON THE WALL!',
      'STAY LOUD FOREVER OR WITNESS THE FALL!'
    ]
  },
  {
    id: 'track-4',
    title: 'BOOGER ATTACK',
    duration: '02:59',
    bpm: 155,
    lyrics: [
      'SLIME-GREEN MENACE DRIPPING FROM THE SKIES',
      'TEARING THROUGH THE STATIC, BLINDING ALL THE LIES!',
      'GREEN LIGHTS FLASHING, INVASION OF THE BRAIN',
      'BOOGER ATTACK DRIFTING DOWN THE DRAIN!',
      'STICKY, TRICKY, LOUD AND CRUDE',
      'WE ARE THE MENACE WITH AN ATTITUDE!'
    ]
  }
];

export const MERCH_DATA: MerchItem[] = [
  {
    id: 'merch-1',
    name: 'SNOT ROCKET Splatter Vinyl',
    price: 25,
    image: 'vinyl',
    description: 'Limited edition slime-green splatter 12" vinyl. Includes custom gatefold jacket, poster, and digital download code.',
    category: 'Music',
  },
  {
    id: 'merch-2',
    name: 'Stay Loud Graffiti Hoodie',
    price: 45,
    image: 'hoodie',
    description: 'Heavyweight 400GSM organic cotton hoodie in faded charcoal. Custom neon green distressed spray-paint design on front and back.',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'merch-3',
    name: 'Classic Logo Tee',
    price: 30,
    image: 'tee',
    description: '100% combed cotton vintage wash tee. Screen-printed with the iconic Flying Booger primary logo. Pre-shrunk for that perfect punk fit.',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'merch-4',
    name: 'Riot Patch & Pin Set',
    price: 12,
    image: 'patches',
    description: 'Set of 3 embroidered iron-on patches and 2 metal enamel pins featuring custom Flying Booger bolt and logo artwork.',
    category: 'Accessories',
  },
  {
    id: 'merch-5',
    name: 'Distortion Ribbed Beanie',
    price: 18,
    image: 'beanie',
    description: 'High-visibility neon lime ribbed knit beanie. Soft, double-layered, and complete with a hand-stitched FLYING BOOGER logo patch.',
    category: 'Accessories',
  }
];
