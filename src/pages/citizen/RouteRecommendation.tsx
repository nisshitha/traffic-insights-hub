import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Route, Clock, Car, ArrowRight, MapPin, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import TrafficBadge from '@/components/TrafficBadge';
import { Progress } from '@/components/ui/progress';
import { areas } from '@/data/mockData';

interface RouteResult {
  id: string;
  name: string;
  distanceKm: number;
  estimatedTimeMins: number;
  congestionLevel: 'low' | 'medium' | 'high';
  stabilityIndex: number;
  futureRisk: 'low' | 'medium' | 'high';
  delayProbability: number;
}

const CitizenRoute = () => {
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!source || !destination) return;
    
    setSearched(true);

    const sourceName = areas.find(a => a.id === source)?.name;
    const destName = areas.find(a => a.id === destination)?.name;

    // Generate routes based on selection
    const generatedRoutes: RouteResult[] = [
      {
        id: '1',
        name: `${sourceName} → ${destName} (via Inner Ring Road)`,
        distanceKm: 12.5,
        estimatedTimeMins: 35,
        congestionLevel: 'low',
        stabilityIndex: 85,
        futureRisk: 'low',
        delayProbability: 12
      },
      {
        id: '2',
        name: `${sourceName} → ${destName} (via Main Road)`,
        distanceKm: 10.2,
        estimatedTimeMins: 42,
        congestionLevel: 'medium',
        stabilityIndex: 58,
        futureRisk: 'medium',
        delayProbability: 38
      },
      {
        id: '3',
        name: `${sourceName} → ${destName} (via Expressway)`,
        distanceKm: 15.8,
        estimatedTimeMins: 28,
        congestionLevel: 'medium',
        stabilityIndex: 72,
        futureRisk: 'medium',
        delayProbability: 25
      },
      {
        id: '4',
        name: `${sourceName} → ${destName} (via City Center)`,
        distanceKm: 8.5,
        estimatedTimeMins: 55,
        congestionLevel: 'high',
        stabilityIndex: 32,
        futureRisk: 'high',
        delayProbability: 65
      }
    ];

    // Sort by a combination of time and stability
    generatedRoutes.sort((a, b) => {
      const scoreA = a.estimatedTimeMins * (1 - a.stabilityIndex / 100);
      const scoreB = b.estimatedTimeMins * (1 - b.stabilityIndex / 100);
      return scoreA - scoreB;
    });
    
    setRoutes(generatedRoutes);
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-600 bg-green-100';
    if (risk === 'medium') return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="citizen" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Smart Route Recommendation</h1>
          <p className="text-muted-foreground">Find the best route based on predicted delay and future risk assessment</p>
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
                disabled={!source || !destination}
              >
                Get Smart Routes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {/* Legend */}
              <div className="pt-4 border-t space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Route Scoring Factors:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• <strong>Stability Index:</strong> Route reliability score</p>
                  <p>• <strong>Future Risk:</strong> Predicted congestion risk</p>
                  <p>• <strong>Delay Probability:</strong> Chance of delays</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!searched ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select source and destination to find routes</p>
                  <p className="text-sm mt-2">Routes are scored by predicted delay & risk</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Recommended Routes (Smart Ranked)</h2>
                {routes.map((route, index) => (
                  <Card 
                    key={route.id} 
                    className={`transition-all ${index === 0 ? 'border-2 border-primary ring-2 ring-primary/20' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {index === 0 && (
                                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded">
                                  Best Route
                                </span>
                              )}
                              <TrafficBadge level={route.congestionLevel} size="sm" />
                              <span className={`text-xs px-2 py-0.5 rounded ${getRiskColor(route.futureRisk)}`}>
                                {route.futureRisk} risk
                              </span>
                            </div>
                            <h3 className="font-semibold mb-2">{route.name}</h3>
                          </div>
                        </div>

                        {/* Metrics Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span>{route.distanceKm} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{route.estimatedTimeMins} mins</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span>Stability: {route.stabilityIndex}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <span>Delay: {route.delayProbability}%</span>
                          </div>
                        </div>

                        {/* Stability Bar */}
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Route Stability</span>
                            <span className={route.stabilityIndex >= 70 ? 'text-green-600' : route.stabilityIndex >= 40 ? 'text-amber-600' : 'text-red-600'}>
                              {route.stabilityIndex}%
                            </span>
                          </div>
                          <Progress value={route.stabilityIndex} className="h-2" />
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
