import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import CongestionCard from '@/components/CongestionCard';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CongestionData {
  id: string;
  congestion_level: 'low' | 'medium' | 'high';
  prediction_10min: 'low' | 'medium' | 'high' | null;
  current_speed: number | null;
  vehicle_density: number | null;
  reason: string | null;
  chennai_areas: {
    name: string;
  };
}

const CitizenCongestion = () => {
  const [congestionData, setCongestionData] = useState<CongestionData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCongestionData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('congestion_data')
      .select(`
        id,
        congestion_level,
        prediction_10min,
        current_speed,
        vehicle_density,
        reason,
        chennai_areas (name)
      `)
      .order('recorded_at', { ascending: false });

    if (!error && data) {
      // Get unique areas with latest data
      const uniqueAreas = new Map();
      data.forEach((item: any) => {
        if (!uniqueAreas.has(item.chennai_areas?.name)) {
          uniqueAreas.set(item.chennai_areas?.name, item);
        }
      });
      setCongestionData(Array.from(uniqueAreas.values()));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCongestionData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Congestion Status</h1>
            <p className="text-muted-foreground">Real-time traffic conditions across Chennai</p>
          </div>
          <Button variant="outline" onClick={fetchCongestionData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {congestionData.map((data) => (
              <CongestionCard
                key={data.id}
                areaName={data.chennai_areas?.name || 'Unknown'}
                currentLevel={data.congestion_level}
                predictedLevel={data.prediction_10min || data.congestion_level}
                currentSpeed={data.current_speed || undefined}
                vehicleDensity={data.vehicle_density || undefined}
                reason={data.reason || undefined}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CitizenCongestion;
