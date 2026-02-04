import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TrafficBadge from './TrafficBadge';
import { MapPin, Gauge, TrendingUp, Car, Activity, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CongestionCardProps {
  areaName: string;
  currentLevel: 'low' | 'medium' | 'high';
  prediction30min: 'low' | 'medium' | 'high';
  prediction1hr?: 'low' | 'medium' | 'high';
  prediction2hr?: 'low' | 'medium' | 'high';
  prediction3hr?: 'low' | 'medium' | 'high';
  currentSpeed?: number;
  vehicleDensity?: number;
  reason?: string;
  stabilityIndex?: number;
}

const CongestionCard = ({
  areaName,
  currentLevel,
  prediction30min,
  prediction1hr,
  prediction2hr,
  prediction3hr,
  currentSpeed,
  vehicleDensity,
  reason,
  stabilityIndex
}: CongestionCardProps) => {
  const getStabilityColor = (index: number) => {
    if (index >= 70) return 'text-green-600';
    if (index >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          {areaName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <TrafficBadge level={currentLevel} size="lg" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">30 min</p>
            <TrafficBadge level={prediction30min} size="lg" />
          </div>
        </div>

        {/* Extended Predictions */}
        {(prediction1hr || prediction2hr || prediction3hr) && (
          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            {prediction1hr && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">1 hr</p>
                <TrafficBadge level={prediction1hr} size="sm" />
              </div>
            )}
            {prediction2hr && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">2 hr</p>
                <TrafficBadge level={prediction2hr} size="sm" />
              </div>
            )}
            {prediction3hr && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">3 hr</p>
                <TrafficBadge level={prediction3hr} size="sm" />
              </div>
            )}
          </div>
        )}

        {/* Metrics */}
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

        {/* Stability Index */}
        {stabilityIndex !== undefined && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Stability Index</p>
              </div>
              <span className={`text-sm font-semibold ${getStabilityColor(stabilityIndex)}`}>
                {stabilityIndex}%
              </span>
            </div>
            <Progress value={stabilityIndex} className="h-1.5" />
          </div>
        )}

        {/* Reason */}
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
