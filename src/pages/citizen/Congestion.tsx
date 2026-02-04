import { useState } from 'react';
import Navbar from '@/components/Navbar';
import CongestionCard from '@/components/CongestionCard';
import { RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { congestionData } from '@/data/mockData';

const CitizenCongestion = () => {
  const [filter, setFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredData = filter === 'all' 
    ? congestionData 
    : congestionData.filter(d => d.congestionLevel === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="citizen" />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Traffic Congestion Prediction</h1>
            <p className="text-muted-foreground">Real-time and predicted traffic conditions with spatiotemporal modeling</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low Only</SelectItem>
                <SelectItem value="medium">Medium Only</SelectItem>
                <SelectItem value="high">High Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Prediction Legend */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Prediction Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Each card shows current status and predictions for 30 min, 1 hr, 2 hr, and 3 hr ahead. 
            The spatiotemporal model tracks traffic evolution across the road network.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((data) => (
            <CongestionCard
              key={data.id}
              areaName={data.areaName}
              currentLevel={data.congestionLevel}
              prediction30min={data.prediction30min}
              prediction1hr={data.prediction1hr}
              prediction2hr={data.prediction2hr}
              prediction3hr={data.prediction3hr}
              currentSpeed={data.currentSpeed}
              vehicleDensity={data.vehicleDensity}
              reason={data.reason}
              stabilityIndex={data.stabilityIndex}
            />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No areas found with the selected congestion level.
          </div>
        )}
      </main>
    </div>
  );
};

export default CitizenCongestion;
