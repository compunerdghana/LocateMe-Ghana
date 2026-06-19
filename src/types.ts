/**
 * Type declarations for LocalServer Ghana Artisan Marketplace
 */

export type UserRole = 'customer' | 'artisan' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  location: string;
  profile_image: string;
  created_at: string;
}

export interface ArtisanProfile {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  description: string;
  region: string;
  city: string;
  gps_location: string; // e.g. GA-123-4567
  years_experience: number;
  verified: boolean;
  featured: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
}

export interface Service {
  id: string;
  artisan_id: string;
  service_name: string;
  price_range: string; // e.g. "GH₵ 100 - GH₵ 250"
  description: string;
}

export interface Review {
  id: string;
  artisan_id: string;
  customer_id: string;
  customer_name: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  artisan_id: string;
  plan: 'free' | 'premium' | 'enterprise';
  start_date: string;
  end_date: string;
  active: boolean;
  price_paid: number;
}

export type ArtisanCategory =
  | 'Electricians'
  | 'Plumbers'
  | 'Carpenters'
  | 'Welders'
  | 'Painters'
  | 'Mechanics'
  | 'AC Technicians'
  | 'Masons'
  | 'Tilers'
  | 'CCTV Installers'
  | 'Solar Technicians'
  | 'Software Developers'
  | 'Cooks'
  | 'Event Planners';

export const ARTISAN_CATEGORIES: ArtisanCategory[] = [
  'Electricians',
  'Plumbers',
  'Carpenters',
  'Welders',
  'Painters',
  'Mechanics',
  'AC Technicians',
  'Masons',
  'Tilers',
  'CCTV Installers',
  'Solar Technicians',
  'Software Developers',
  'Cooks',
  'Event Planners',
];

export const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Volta',
  'Northern',
  'Central',
  'Bono',
  'Upper East',
  'Upper West',
];

export const REGION_CITIES: Record<string, string[]> = {
  'Greater Accra': ['Accra', 'Tema', 'Madina', 'Adenta', 'Kasoa (Border)', 'Spintex', 'East Legon'],
  'Ashanti': ['Kumasi', 'Obuasi', 'Konongo', 'Mampong', 'Ejisu'],
  'Western': ['Takoradi', 'Sekondi', 'Tarkwa', 'Axim'],
  'Eastern': ['Koforidua', 'Nkawkaw', 'Suhum', 'Oda'],
  'Volta': ['Ho', 'Keta', 'Aflao', 'Hohoe'],
  'Northern': ['Tamale', 'Yendi', 'Savelugu'],
  'Central': ['Cape Coast', 'Winneba', 'Manso', 'Elmina'],
  'Bono': ['Sunyani', 'Berekum', 'Techiman'],
  'Upper East': ['Bolgatanga', 'Navrongo'],
  'Upper West': ['Wa'],
};
