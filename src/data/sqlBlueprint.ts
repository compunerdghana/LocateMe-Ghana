export const SUPABASE_SQL_SCHEMA = `-- LOCALSERVER GHANA - SUPABASE POSTGRESQL SCHEMA
-- Built for High-Performance Artisan Directory Marketplace in Ghana

-- Enable UUID Extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create PROFILES Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'artisan', 'admin')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create ARTISAN_PROFILES Table
CREATE TABLE IF NOT EXISTS public.artisan_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  gps_location VARCHAR(50) NOT NULL, -- e.g. Ghana Post GPS: GA-233-1024
  years_experience INTEGER DEFAULT 0 NOT NULL,
  verified BOOLEAN DEFAULT FALSE NOT NULL,
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  average_rating NUMERIC(3,2) DEFAULT 0.0 NOT NULL,
  total_reviews INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create SERVICES Table (Bespoke offerings by Artisans)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artisan_id UUID REFERENCES public.artisan_profiles(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  price_range TEXT NOT NULL, -- e.g. "GH₵ 100 - GH₵ 300"
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create REVIEWS Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artisan_id UUID REFERENCES public.artisan_profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(artisan_id, customer_id) -- One review per artisan per customer
);

-- 5. Create SUBSCRIPTIONS Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artisan_id UUID REFERENCES public.artisan_profiles(id) ON DELETE CASCADE NOT NULL,
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('free', 'premium', 'enterprise')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

---------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
---------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- A. Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile during registration" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- B. Artisan Profiles RLS Policies
CREATE POLICY "Artisan profiles are viewable by everyone" ON public.artisan_profiles
  FOR SELECT USING (true);

CREATE POLICY "Artisans can update their own artisan profile" ON public.artisan_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Artisans can insert their own artisan profile" ON public.artisan_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- C. Services RLS Policies
CREATE POLICY "Services are viewable by everyone" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Artisans can modify their own services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.artisan_profiles 
      WHERE artisan_profiles.id = services.artisan_id 
      AND artisan_profiles.user_id = auth.uid()
    )
  );

-- D. Reviews RLS Policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Registered customers can insert a review" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'customer')
  );

CREATE POLICY "Users can update or delete their own review" ON public.reviews
  FOR UPDATE USING (auth.uid() = customer_id);

-- E. Subscriptions RLS Policies
CREATE POLICY "Subscriptions are viewable by public/system" ON public.subscriptions
  FOR SELECT USING (true);

CREATE POLICY "Artisans can view their own subscription status" ON public.subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.artisan_profiles 
      WHERE artisan_profiles.id = subscriptions.artisan_id 
      AND artisan_profiles.user_id = auth.uid()
    )
  );

---------------------------------------------------------
-- DYNAMIC TRIGGERS: AUTOMATICALLY RECALCULATE RATINGS
---------------------------------------------------------

-- Function to update artisan review summary info
CREATE OR REPLACE FUNCTION public.update_artisan_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Re-calculate ratings for the affected artisan
  UPDATE public.artisan_profiles
  SET 
    average_rating = COALESCE((SELECT AVG(rating) FROM public.reviews WHERE artisan_id = NEW.artisan_id), 0),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE artisan_id = NEW.artisan_id)
  WHERE id = NEW.artisan_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_artisan_ratings
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_artisan_ratings();
`;

export const DEPLOYMENT_GUIDE_MD = `## Deployment & Setup Guide for LocalServer Ghana

This guide explains how to connect this application structure to a live **Supabase** backend and host it on **Vercel**.

### Step 1: Set Up Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Select your Database region nearest to Ghana (e.g., \`eu-west-2\` London or \`eu-central-1\` Frankfurt for optimal latency).
3. Secure your Database with a strong password.

### Step 2: Initialize Database & RLS
1. Navigate to the **SQL Editor** in the Supabase Dashboard.
2. Click **New Query** and paste the **Database Schema SQL** provided in the SQL blue tab above.
3. Click **Run** to generate the tables, Row Level Security policies, and the rating-recalculation trigger.

### Step 3: Configure Env Secrets & Supabase Auth
In your project (or Vercel Settings), configure the following key-value pairs:
\`\`\`env
# Client-side (Public keys)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Service role client keys (Server-side)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
\`\`\`

#### Configure Authentication Providers:
- Go to **Authentication** -> **Providers** -> **Google**.
- Enable Google OAuth sign-in.
- Configure Google Credentials (client id and secret) from the Google Cloud Console.
- Set the redirect URI to: \`https://your-project.supabase.co/auth/v1/callback\`

### Step 4: Storage Configurations (Optional)
To support file/portfolio uploads securely:
1. Go to **Storage** -> **Create a New Bucket** named \`portfolios\`.
2. Set the configuration as **Public**.
3. Create security rules allowing WRITE access to authenticated users whose profile role is \`artisan\`.

### Step 5: Connect Mobile Money (MTN, Vodafone, AirtelTigo) via Paystack
For production payments inside Ghana:
1. Register a merchant account at [Paystack Integration](https://paystack.com/).
2. Grab your \`PAYSTACK_SECRET_KEY\` and put it in your environment variables.
3. Use Paystack Standard SDK to initiate Mobile Money popups, passing \`currency: "GHS"\` and target \`channels: ["mobile_money", "card"]\`.
`;
