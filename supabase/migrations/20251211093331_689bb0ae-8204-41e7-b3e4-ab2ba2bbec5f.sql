-- Add prediction columns for extended forecasting
ALTER TABLE public.congestion_data 
ADD COLUMN IF NOT EXISTS prediction_30min text,
ADD COLUMN IF NOT EXISTS prediction_1hr text,
ADD COLUMN IF NOT EXISTS prediction_2hr text,
ADD COLUMN IF NOT EXISTS prediction_3hr text;

-- Add index for faster queries on area lookups
CREATE INDEX IF NOT EXISTS idx_congestion_data_area_recorded 
ON public.congestion_data (area_id, recorded_at DESC);