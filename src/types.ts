export interface Gig {
  id: string;
  date: string;
  location: string;
  venue: string;
  soldOut: boolean;
  lowTickets?: boolean;
  price: number;
}

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'Apparel' | 'Music' | 'Accessories';
  sizes?: string[];
}

export interface CartItem {
  item: MerchItem;
  quantity: number;
  selectedSize?: string;
}

export interface Shoutout {
  id: string;
  name: string;
  message: string;
  color: string;
  timestamp: string;
  angle: number;
}

export interface Track {
  id: string;
  title: string;
  duration: string;
  bpm: number;
  lyrics?: string[];
}
