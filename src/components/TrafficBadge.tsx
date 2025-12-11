import { cn } from '@/lib/utils';

interface TrafficBadgeProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const TrafficBadge = ({ level, size = 'md', showText = true }: TrafficBadgeProps) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const colorClasses = {
    low: 'bg-traffic-low',
    medium: 'bg-traffic-medium',
    high: 'bg-traffic-high'
  };

  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        'rounded-full inline-block',
        sizeClasses[size],
        colorClasses[level]
      )} />
      {showText && (
        <span className={cn(
          'font-medium capitalize',
          textSizeClasses[size],
          level === 'low' && 'text-traffic-low',
          level === 'medium' && 'text-traffic-medium',
          level === 'high' && 'text-traffic-high'
        )}>
          {labels[level]}
        </span>
      )}
    </div>
  );
};

export default TrafficBadge;
