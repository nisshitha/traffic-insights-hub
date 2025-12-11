import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import ChennaiMap from '@/components/ChennaiMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import TrafficBadge from '@/components/TrafficBadge';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  congestionLevel: 'low' | 'medium' | 'high';
  isHotspot?: boolean;
  speed?: number;
  density?: number;
  prediction?: string;
  reason?: string;
}

const AuthorityMap = () => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: congestionData } = await supabase
        .from('congestion_data')
        .select(`
          id,
          congestion_level,
          prediction_10min,
          current_speed,
          vehicle_density,
          reason,
          chennai_areas (id, name, latitude, longitude)
        `)
        .order('recorded_at', { ascending: false });

      if (congestionData) {
        const uniqueMarkers = new Map<string, MapMarker>();
        
        congestionData.forEach((item: any) => {
          const area = item.chennai_areas;
          if (area && !uniqueMarkers.has(area.id)) {
            uniqueMarkers.set(area.id, {
              id: area.id,
              lat: Number(area.latitude),
              lng: Number(area.longitude),
              name: area.name,
              congestionLevel: item.congestion_level,
              isHotspot: item.prediction_10min === 'high' && item.congestion_level !== 'high',
              speed: item.current_speed,
              density: item.vehicle_density,
              prediction: item.prediction_10min,
              reason: item.reason
            });
          }
        });

        setMarkers(Array.from(uniqueMarkers.values()));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const hotspots = markers.filter(m => m.isHotspot);
  const highCongestion = markers.filter(m => m.congestionLevel === 'high');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold mb-2">Live Congestion Map</h1>
          <p className="text-muted-foreground">Real-time traffic visualization across Chennai</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Map */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <ChennaiMap 
                  markers={markers} 
                  onMarkerClick={setSelectedMarker}
                  className="h-[600px] rounded-lg"
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Legend */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-traffic-low" />
                    <span className="text-sm">Low Congestion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-traffic-medium" />
                    <span className="text-sm">Medium Congestion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-traffic-high" />
                    <span className="text-sm">High Congestion</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <span className="h-3 w-3 rounded-full bg-traffic-high animate-pulse" />
                    <span className="text-sm">Predicted Hotspot</span>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {hotspots.length > 0 && (
                <Card className="border-amber-500/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Predicted Hotspots
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {hotspots.map(spot => (
                      <div key={spot.id} className="text-sm flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-amber-500" />
                        {spot.name}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* High Congestion Areas */}
              {highCongestion.length > 0 && (
                <Card className="border-red-500/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      High Congestion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {highCongestion.map(area => (
                      <div key={area.id} className="text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-red-500" />
                          {area.name}
                        </div>
                        {area.speed && (
                          <p className="text-xs text-muted-foreground ml-5">
                            {area.speed} km/h
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Selected Zone Details */}
              {selectedMarker && (
                <Card className="border-primary/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{selectedMarker.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <TrafficBadge level={selectedMarker.congestionLevel} size="sm" />
                    </div>
                    {selectedMarker.speed && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Speed:</span>
                        <span>{selectedMarker.speed} km/h</span>
                      </div>
                    )}
                    {selectedMarker.density && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Density:</span>
                        <span>{selectedMarker.density} veh/km</span>
                      </div>
                    )}
                    {selectedMarker.prediction && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">10 min:</span>
                        <span className="capitalize">{selectedMarker.prediction}</span>
                      </div>
                    )}
                    {selectedMarker.reason && (
                      <div className="pt-2 border-t">
                        <span className="text-muted-foreground">Reason:</span>
                        <p>{selectedMarker.reason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthorityMap;
