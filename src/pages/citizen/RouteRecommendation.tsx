import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Route, Clock, Car, ArrowRight, Loader2, MapPin } from 'lucide-react';
import TrafficBadge from '@/components/TrafficBadge';

interface Area {
  id: string;
  name: string;
  zone: string;
}

interface RouteResult {
  name: string;
  distance_km: number;
  estimated_time_mins: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

const CitizenRoute = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      const { data } = await supabase
        .from('chennai_areas')
        .select('id, name, zone')
        .order('name');
      if (data) setAreas(data);
    };
    fetchAreas();
  }, []);

  const handleSearch = async () => {
    if (!source || !destination) return;
    
    setLoading(true);
    setSearched(true);

    // Simulate route finding with congestion data
    const { data: congestionData } = await supabase
      .from('congestion_data')
      .select('area_id, congestion_level')
      .order('recorded_at', { ascending: false });

    const sourceName = areas.find(a => a.id === source)?.name;
    const destName = areas.find(a => a.id === destination)?.name;

    // Create mock routes based on actual areas
    const mockRoutes: RouteResult[] = [
      {
        name: `${sourceName} → ${destName} (via Main Road)`,
        distance_km: Math.round((5 + Math.random() * 15) * 10) / 10,
        estimated_time_mins: Math.round(15 + Math.random() * 30),
        congestionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
      },
      {
        name: `${sourceName} → ${destName} (via Ring Road)`,
        distance_km: Math.round((8 + Math.random() * 20) * 10) / 10,
        estimated_time_mins: Math.round(20 + Math.random() * 25),
        congestionLevel: ['low', 'medium'][Math.floor(Math.random() * 2)] as 'low' | 'medium'
      },
      {
        name: `${sourceName} → ${destName} (via Inner Roads)`,
        distance_km: Math.round((4 + Math.random() * 10) * 10) / 10,
        estimated_time_mins: Math.round(25 + Math.random() * 35),
        congestionLevel: ['medium', 'high'][Math.floor(Math.random() * 2)] as 'medium' | 'high'
      }
    ];

    // Sort by estimated time
    mockRoutes.sort((a, b) => a.estimated_time_mins - b.estimated_time_mins);
    
    setRoutes(mockRoutes);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Route Recommendation</h1>
          <p className="text-muted-foreground">Find the best route between Chennai areas</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-primary" />
                Plan Your Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Source Area</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select starting point" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id} disabled={area.id === destination}>
                        {area.name} ({area.zone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Destination Area</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id} disabled={area.id === source}>
                        {area.name} ({area.zone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                onClick={handleSearch}
                disabled={!source || !destination || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Finding Routes...
                  </>
                ) : (
                  <>
                    Get Best Route
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!searched ? (
              <Card className="h-full flex items-center justify-center min-h-[300px]">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select source and destination to find routes</p>
                </div>
              </Card>
            ) : loading ? (
              <Card className="h-full flex items-center justify-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Recommended Routes</h2>
                {routes.map((route, index) => (
                  <Card 
                    key={index} 
                    className={`transition-all ${index === 0 ? 'border-2 border-primary ring-2 ring-primary/20' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {index === 0 && (
                              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded">
                                Best Route
                              </span>
                            )}
                            <TrafficBadge level={route.congestionLevel} size="sm" />
                          </div>
                          <h3 className="font-semibold mb-2">{route.name}</h3>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              {route.distance_km} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {route.estimated_time_mins} mins
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CitizenRoute;
