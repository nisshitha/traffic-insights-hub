import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrafficBadge from './TrafficBadge';
import { MapPin, Gauge, TrendingUp, Car } from 'lucide-react';

interface CongestionCardProps {
  areaName: string;
  currentLevel: 'low' | 'medium' | 'high';
  predictedLevel: 'low' | 'medium' | 'high';
  currentSpeed?: number;
  vehicleDensity?: number;
  reason?: string;
}

const CongestionCard = ({
  areaName,
  currentLevel,
  predictedLevel,
  currentSpeed,
  vehicleDensity,
  reason
}: CongestionCardProps) => {
  return (
    <Card className="animate-fade-in hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          {areaName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <TrafficBadge level={currentLevel} size="lg" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">10 min forecast</p>
            <TrafficBadge level={predictedLevel} size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          {currentSpeed !== undefined && (
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Speed</p>
                <p className="font-semibold">{currentSpeed} km/h</p>
              </div>
            </div>
          )}
          {vehicleDensity !== undefined && (
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Density</p>
                <p className="font-semibold">{vehicleDensity} veh/km</p>
              </div>
            </div>
          )}
        </div>

        {reason && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Reason</p>
            <p className="text-sm">{reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CongestionCard;
