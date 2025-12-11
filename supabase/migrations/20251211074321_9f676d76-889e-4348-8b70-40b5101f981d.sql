-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('citizen', 'authority');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL DEFAULT 'citizen',
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create Chennai areas table
CREATE TABLE public.chennai_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    zone TEXT NOT NULL
);

-- Enable RLS (public read)
ALTER TABLE public.chennai_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read areas"
ON public.chennai_areas
FOR SELECT
USING (true);

-- Create routes table
CREATE TABLE public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_area_id UUID REFERENCES public.chennai_areas(id),
    end_area_id UUID REFERENCES public.chennai_areas(id),
    distance_km DECIMAL(6, 2),
    estimated_time_mins INTEGER,
    path_coordinates JSONB
);

-- Enable RLS (public read)
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read routes"
ON public.routes
FOR SELECT
USING (true);

-- Create congestion data table
CREATE TABLE public.congestion_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area_id UUID REFERENCES public.chennai_areas(id) NOT NULL,
    congestion_level TEXT NOT NULL CHECK (congestion_level IN ('low', 'medium', 'high')),
    current_speed DECIMAL(5, 2),
    vehicle_density INTEGER,
    prediction_10min TEXT CHECK (prediction_10min IN ('low', 'medium', 'high')),
    reason TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (public read)
ALTER TABLE public.congestion_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read congestion"
ON public.congestion_data
FOR SELECT
USING (true);

-- Create route analytics table
CREATE TABLE public.route_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES public.routes(id) NOT NULL,
    date DATE NOT NULL,
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    avg_speed DECIMAL(5, 2),
    congestion_frequency INTEGER,
    weather_condition TEXT,
    prediction_accuracy DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (public read)
ALTER TABLE public.route_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analytics"
ON public.route_analytics
FOR SELECT
USING (true);

-- Create chat history table for AI interactions
CREATE TABLE public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    chat_type TEXT NOT NULL CHECK (chat_type IN ('citizen', 'authority')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on chat history
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Users can read their own chat history
CREATE POLICY "Users can read own chat"
ON public.chat_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own chat messages
CREATE POLICY "Users can insert own chat"
ON public.chat_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Trigger to create profile and assign role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_role user_role;
BEGIN
  -- Get role from metadata, default to 'citizen'
  selected_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'citizen'::user_role
  );
  
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, selected_role);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert Chennai areas data
INSERT INTO public.chennai_areas (name, latitude, longitude, zone) VALUES
('T. Nagar', 13.0418, 80.2341, 'Central'),
('Adyar', 13.0067, 80.2573, 'South'),
('Velachery', 12.9815, 80.2176, 'South'),
('Anna Nagar', 13.0850, 80.2101, 'North'),
('Guindy', 13.0067, 80.2206, 'South'),
('OMR', 12.9165, 80.2274, 'South'),
('ECR', 12.9850, 80.2531, 'East'),
('Tambaram', 12.9249, 80.1000, 'South'),
('Perambur', 13.1067, 80.2447, 'North'),
('Mylapore', 13.0343, 80.2688, 'Central'),
('Egmore', 13.0732, 80.2609, 'Central'),
('Nungambakkam', 13.0569, 80.2425, 'Central'),
('Porur', 13.0381, 80.1563, 'West'),
('Vadapalani', 13.0524, 80.2121, 'West'),
('Thiruvanmiyur', 12.9830, 80.2594, 'South'),
('Sholinganallur', 12.8940, 80.2279, 'South'),
('Pallavaram', 12.9675, 80.1491, 'South'),
('Chromepet', 12.9516, 80.1462, 'South'),
('Madhavaram', 13.1485, 80.2319, 'North'),
('Ambattur', 13.1143, 80.1548, 'North'),
('Chennai Airport', 12.9941, 80.1709, 'South'),
('Chennai Central', 13.0827, 80.2707, 'Central'),
('Marina Beach', 13.0500, 80.2824, 'East'),
('Tidel Park', 12.9881, 80.2476, 'South'),
('SIPCOT IT Park', 12.8657, 80.2259, 'South');

-- Insert sample routes
INSERT INTO public.routes (name, start_area_id, end_area_id, distance_km, estimated_time_mins) 
SELECT 
  'T. Nagar to OMR' as name,
  (SELECT id FROM public.chennai_areas WHERE name = 'T. Nagar') as start_area_id,
  (SELECT id FROM public.chennai_areas WHERE name = 'OMR') as end_area_id,
  18.5 as distance_km,
  45 as estimated_time_mins;

INSERT INTO public.routes (name, start_area_id, end_area_id, distance_km, estimated_time_mins) 
SELECT 
  'Anna Nagar to Guindy' as name,
  (SELECT id FROM public.chennai_areas WHERE name = 'Anna Nagar') as start_area_id,
  (SELECT id FROM public.chennai_areas WHERE name = 'Guindy') as end_area_id,
  12.3 as distance_km,
  35 as estimated_time_mins;

INSERT INTO public.routes (name, start_area_id, end_area_id, distance_km, estimated_time_mins) 
SELECT 
  'Velachery to Chennai Airport' as name,
  (SELECT id FROM public.chennai_areas WHERE name = 'Velachery') as start_area_id,
  (SELECT id FROM public.chennai_areas WHERE name = 'Chennai Airport') as end_area_id,
  15.2 as distance_km,
  40 as estimated_time_mins;

INSERT INTO public.routes (name, start_area_id, end_area_id, distance_km, estimated_time_mins) 
SELECT 
  'OMR (Tidel Park)' as name,
  (SELECT id FROM public.chennai_areas WHERE name = 'Tidel Park') as start_area_id,
  (SELECT id FROM public.chennai_areas WHERE name = 'Sholinganallur') as end_area_id,
  8.5 as distance_km,
  25 as estimated_time_mins;

INSERT INTO public.routes (name, start_area_id, end_area_id, distance_km, estimated_time_mins) 
SELECT 
  'ECR (Adyar to Thiruvanmiyur)' as name,
  (SELECT id FROM public.chennai_areas WHERE name = 'Adyar') as start_area_id,
  (SELECT id FROM public.chennai_areas WHERE name = 'Thiruvanmiyur') as end_area_id,
  5.0 as distance_km,
  15 as estimated_time_mins;

INSERT INTO public.routes (name, start_area_id, end_area_id, distance_km, estimated_time_mins) 
SELECT 
  'GST Road (Guindy to Tambaram)' as name,
  (SELECT id FROM public.chennai_areas WHERE name = 'Guindy') as start_area_id,
  (SELECT id FROM public.chennai_areas WHERE name = 'Tambaram') as end_area_id,
  16.0 as distance_km,
  40 as estimated_time_mins;

-- Insert sample congestion data for all areas
INSERT INTO public.congestion_data (area_id, congestion_level, current_speed, vehicle_density, prediction_10min, reason)
SELECT 
  id,
  CASE 
    WHEN name IN ('OMR', 'Guindy', 'T. Nagar') THEN 'high'
    WHEN name IN ('Anna Nagar', 'Velachery', 'Adyar', 'Tidel Park') THEN 'medium'
    ELSE 'low'
  END,
  CASE 
    WHEN name IN ('OMR', 'Guindy', 'T. Nagar') THEN 15.0
    WHEN name IN ('Anna Nagar', 'Velachery', 'Adyar', 'Tidel Park') THEN 30.0
    ELSE 45.0
  END,
  CASE 
    WHEN name IN ('OMR', 'Guindy', 'T. Nagar') THEN 850
    WHEN name IN ('Anna Nagar', 'Velachery', 'Adyar', 'Tidel Park') THEN 500
    ELSE 200
  END,
  CASE 
    WHEN name IN ('OMR', 'Tidel Park') THEN 'high'
    WHEN name IN ('Anna Nagar', 'Velachery', 'Guindy') THEN 'medium'
    ELSE 'low'
  END,
  CASE 
    WHEN name IN ('OMR', 'Tidel Park') THEN 'Peak office hours + IT corridor'
    WHEN name = 'Guindy' THEN 'Industrial area traffic'
    WHEN name = 'T. Nagar' THEN 'Shopping district congestion'
    WHEN name IN ('Anna Nagar', 'Velachery') THEN 'Residential area rush hour'
    ELSE 'Normal traffic flow'
  END
FROM public.chennai_areas;

-- Insert sample route analytics
INSERT INTO public.route_analytics (route_id, date, hour, avg_speed, congestion_frequency, weather_condition, prediction_accuracy)
SELECT 
  r.id,
  CURRENT_DATE,
  h.hour,
  CASE 
    WHEN h.hour BETWEEN 8 AND 10 OR h.hour BETWEEN 17 AND 20 THEN 15.0 + random() * 10
    ELSE 35.0 + random() * 15
  END,
  CASE 
    WHEN h.hour BETWEEN 8 AND 10 OR h.hour BETWEEN 17 AND 20 THEN 75 + floor(random() * 20)::int
    ELSE 20 + floor(random() * 30)::int
  END,
  'Clear',
  85.0 + random() * 10
FROM public.routes r
CROSS JOIN generate_series(6, 22) AS h(hour);