-- LocalLens AI - Supabase Database Schema DDL
-- This file configures the tables, relationships, and Row Level Security (RLS) policies.

-- 1. Create Demo Users Table (for credentials)
CREATE TABLE IF NOT EXISTS public.demo_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- In production, passwords must be hashed!
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Demo Credentials (Username: admin, Password: admin123)
-- Only insert if it doesn't already exist
INSERT INTO public.demo_users (username, password)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- 2. Create Travel Preferences Table
CREATE TABLE IF NOT EXISTS public.travel_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Can map to auth.users.id
    personality TEXT NOT NULL,
    favorite_destination TEXT NOT NULL,
    transport_pref TEXT NOT NULL,
    travel_group TEXT NOT NULL,
    food_pref TEXT NOT NULL,
    budget TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Travel Preferences
ALTER TABLE public.travel_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read/write their own preferences
CREATE POLICY "Allow users to read their own preferences" 
    ON public.travel_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own preferences" 
    ON public.travel_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own preferences" 
    ON public.travel_preferences FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Create Saved Destinations Table
CREATE TABLE IF NOT EXISTS public.saved_destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.saved_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own saved destinations" 
    ON public.saved_destinations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own saved destinations" 
    ON public.saved_destinations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own saved destinations" 
    ON public.saved_destinations FOR DELETE 
    USING (auth.uid() = user_id);

-- 4. Create Trip Plans Table
CREATE TABLE IF NOT EXISTS public.trip_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    destination TEXT NOT NULL,
    budget TEXT NOT NULL,
    dates TEXT NOT NULL,
    group_size INTEGER NOT NULL,
    interests TEXT[] NOT NULL,
    itinerary JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trip_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own trip plans" 
    ON public.trip_plans FOR ALL 
    USING (auth.uid() = user_id);

-- 5. Create Stories Table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    attraction_name TEXT NOT NULL,
    story_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own stories" 
    ON public.stories FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own stories" 
    ON public.stories FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 6. Create Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL, -- 'attraction', 'stay', 'gem'
    item_id TEXT NOT NULL,
    details JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own favorites" 
    ON public.favorites FOR ALL 
    USING (auth.uid() = user_id);

-- 7. Create Search History Table
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    query TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own search history" 
    ON public.search_history FOR ALL 
    USING (auth.uid() = user_id);
