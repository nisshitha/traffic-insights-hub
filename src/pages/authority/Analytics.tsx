import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Clock, Gauge, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import { analyticsData } from '@/data/mockData';

const routes = [
  { id: '1', name: 'OMR IT Corridor' },
  { id: '2', name: 'Inner Ring Road' },
  { id: '3', name: 'Mount Road (Anna Salai)' },
  { id: '4', name: 'ECR Coastal Route' },
  { id: '5', name: 'Guindy Industrial Zone' },
];

const AuthorityAnalytics = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('1');

  // Calculate summary metrics
  const avgSpeed = (analyticsData.reduce((sum, d) => sum + d.avgSpeed, 0) / analyticsData.length).toFixed(1);
  
  const peakHours = analyticsData
    .filter(d => d.congestionFrequency > 70)
    .map(d => `${d.hour}:00`)
    .slice(0, 3);

  const avgCongestion = (analyticsData.reduce((sum, d) => sum + d.congestionFrequency, 0) / analyticsData.length).toFixed(0);
  
  const avgAccuracy = (analyticsData.reduce((sum, d) => sum + d.predictionAccuracy, 0) / analyticsData.length).toFixed(0);

  const chartData = analyticsData.map(d => ({
    time: `${d.hour}:00`,
    speed: d.avgSpeed,
    congestion: d.congestionFrequency,
    accuracy: d.predictionAccuracy
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="authority" />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Route Analytics Dashboard</h1>
            <p className="text-muted-foreground">Performance analysis and metrics visualization</p>
          </div>
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select route" />
            </SelectTrigger>
            <SelectContent>
              {routes.map(route => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gauge className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Speed</p>
                  <p className="text-2xl font-bold">{avgSpeed} km/h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peak Hours</p>
                  <p className="text-lg font-bold">{peakHours.join(', ') || 'None'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Congestion</p>
                  <p className="text-2xl font-bold">{avgCongestion}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                  <p className="text-2xl font-bold">{avgAccuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Speed Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Average Speed Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="speed" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                    name="Speed (km/h)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Congestion Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Congestion Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="congestion" 
                    fill="hsl(var(--accent))" 
                    radius={[4, 4, 0, 0]}
                    name="Congestion (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hourly Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Time</th>
                    <th className="text-left py-3 px-4 font-medium">Avg Speed</th>
                    <th className="text-left py-3 px-4 font-medium">Congestion</th>
                    <th className="text-left py-3 px-4 font-medium">Prediction Accuracy</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 px-4">{row.time}</td>
                      <td className="py-3 px-4">{row.speed} km/h</td>
                      <td className="py-3 px-4">{row.congestion}%</td>
                      <td className="py-3 px-4">{row.accuracy}%</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          row.congestion > 70 ? 'bg-destructive/10 text-destructive' :
                          row.congestion > 40 ? 'bg-accent/10 text-accent' :
                          'bg-secondary/10 text-secondary'
                        }`}>
                          {row.congestion > 70 ? 'High' : row.congestion > 40 ? 'Medium' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthorityAnalytics;
