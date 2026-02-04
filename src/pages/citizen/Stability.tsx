import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, TrendingUp, TrendingDown, Minus, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { congestionData } from '@/data/mockData';

const CitizenStability = () => {
  // Sort by stability index
  const sortedData = [...congestionData].sort((a, b) => b.stabilityIndex - a.stabilityIndex);
  
  const stableRoutes = sortedData.filter(d => d.stabilityIndex >= 70);
  const moderateRoutes = sortedData.filter(d => d.stabilityIndex >= 40 && d.stabilityIndex < 70);
  const unstableRoutes = sortedData.filter(d => d.stabilityIndex < 40);

  const avgStability = Math.round(sortedData.reduce((acc, d) => acc + d.stabilityIndex, 0) / sortedData.length);

  const getStabilityColor = (index: number) => {
    if (index >= 70) return 'text-green-600';
    if (index >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStabilityBg = (index: number) => {
    if (index >= 70) return 'bg-green-100 border-green-200';
    if (index >= 40) return 'bg-amber-100 border-amber-200';
    return 'bg-red-100 border-red-200';
  };

  const getTrend = (current: string, prediction: string) => {
    const levels = { low: 1, medium: 2, high: 3 };
    const diff = levels[prediction as keyof typeof levels] - levels[current as keyof typeof levels];
    if (diff > 0) return { icon: TrendingUp, color: 'text-red-500', label: 'Worsening' };
    if (diff < 0) return { icon: TrendingDown, color: 'text-green-500', label: 'Improving' };
    return { icon: Minus, color: 'text-muted-foreground', label: 'Stable' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="citizen" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Traffic Stability Index</h1>
          <p className="text-muted-foreground">Identify reliable routes that are less prone to sudden congestion changes</p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Stability</p>
                  <p className="text-2xl font-bold">{avgStability}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-700">Highly Stable</p>
                  <p className="text-2xl font-bold text-green-800">{stableRoutes.length} routes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Minus className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Moderate</p>
                  <p className="text-2xl font-bold text-amber-800">{moderateRoutes.length} routes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-red-700">Unstable</p>
                  <p className="text-2xl font-bold text-red-800">{unstableRoutes.length} routes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explanation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Understanding Stability Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold text-green-800 mb-1">70-100% (Stable)</p>
                <p className="text-green-700">Reliable routes with consistent traffic patterns. Low risk of sudden congestion.</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="font-semibold text-amber-800 mb-1">40-69% (Moderate)</p>
                <p className="text-amber-700">Some variability expected. Plan for minor delays during peak hours.</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-semibold text-red-800 mb-1">0-39% (Unstable)</p>
                <p className="text-red-700">Highly variable conditions. Avoid for time-sensitive travel.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Stability List */}
        <Card>
          <CardHeader>
            <CardTitle>Route Stability Rankings</CardTitle>
            <CardDescription>All monitored routes sorted by stability score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedData.map((route, index) => {
                const trend = getTrend(route.congestionLevel, route.prediction1hr);
                const TrendIcon = trend.icon;
                
                return (
                  <div 
                    key={route.id} 
                    className={`p-4 rounded-lg border ${getStabilityBg(route.stabilityIndex)}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{route.areaName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{route.currentSpeed} km/h</span>
                            <span>•</span>
                            <TrendIcon className={`h-3 w-3 ${trend.color}`} />
                            <span className={trend.color}>{trend.label}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 ml-11 md:ml-0">
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Stability</span>
                            <span className={getStabilityColor(route.stabilityIndex)}>{route.stabilityIndex}%</span>
                          </div>
                          <Progress value={route.stabilityIndex} className="h-2" />
                        </div>
                        <div className={`px-3 py-1 rounded text-xs font-medium ${
                          route.stabilityIndex >= 70 ? 'bg-green-200 text-green-800' :
                          route.stabilityIndex >= 40 ? 'bg-amber-200 text-amber-800' :
                          'bg-red-200 text-red-800'
                        }`}>
                          {route.stabilityIndex >= 70 ? 'Reliable' : route.stabilityIndex >= 40 ? 'Variable' : 'Avoid'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CitizenStability;
