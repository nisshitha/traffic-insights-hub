// Static demo data for frontend-only version
// Replace with real API calls when backend is connected

export interface Area {
  id: string;
  name: string;
  zone: string;
  latitude: number;
  longitude: number;
}

export interface CongestionData {
  id: string;
  areaId: string;
  areaName: string;
  congestionLevel: 'low' | 'medium' | 'high';
  prediction30min: 'low' | 'medium' | 'high';
  prediction1hr: 'low' | 'medium' | 'high';
  prediction2hr: 'low' | 'medium' | 'high';
  prediction3hr: 'low' | 'medium' | 'high';
  currentSpeed: number;
  vehicleDensity: number;
  reason: string;
  stabilityIndex: number; // 0-100
}

export interface RouteData {
  id: string;
  name: string;
  distanceKm: number;
  estimatedTimeMins: number;
  congestionLevel: 'low' | 'medium' | 'high';
  stabilityIndex: number;
  futureRisk: 'low' | 'medium' | 'high';
  delayProbability: number;
}

export interface AnalyticsData {
  hour: number;
  avgSpeed: number;
  congestionFrequency: number;
  predictionAccuracy: number;
}

export const areas: Area[] = [
  { id: '1', name: 'T. Nagar', zone: 'Central', latitude: 13.0418, longitude: 80.2341 },
  { id: '2', name: 'Anna Nagar', zone: 'North', latitude: 13.0850, longitude: 80.2101 },
  { id: '3', name: 'Velachery', zone: 'South', latitude: 12.9815, longitude: 80.2180 },
  { id: '4', name: 'Adyar', zone: 'South', latitude: 13.0012, longitude: 80.2565 },
  { id: '5', name: 'Guindy', zone: 'South', latitude: 13.0067, longitude: 80.2206 },
  { id: '6', name: 'Egmore', zone: 'Central', latitude: 13.0732, longitude: 80.2609 },
  { id: '7', name: 'Mylapore', zone: 'Central', latitude: 13.0368, longitude: 80.2676 },
  { id: '8', name: 'Tambaram', zone: 'South', latitude: 12.9249, longitude: 80.1000 },
  { id: '9', name: 'Porur', zone: 'West', latitude: 13.0382, longitude: 80.1565 },
  { id: '10', name: 'Perungudi', zone: 'South', latitude: 12.9653, longitude: 80.2461 },
  { id: '11', name: 'OMR', zone: 'South-East', latitude: 12.9400, longitude: 80.2300 },
  { id: '12', name: 'ECR', zone: 'East', latitude: 12.9800, longitude: 80.2700 },
];

export const congestionData: CongestionData[] = [
  {
    id: '1', areaId: '1', areaName: 'T. Nagar',
    congestionLevel: 'high', prediction30min: 'high', prediction1hr: 'medium', prediction2hr: 'medium', prediction3hr: 'low',
    currentSpeed: 12, vehicleDensity: 85, reason: 'Peak shopping hours', stabilityIndex: 35
  },
  {
    id: '2', areaId: '2', areaName: 'Anna Nagar',
    congestionLevel: 'medium', prediction30min: 'medium', prediction1hr: 'high', prediction2hr: 'medium', prediction3hr: 'low',
    currentSpeed: 28, vehicleDensity: 55, reason: 'School zone traffic', stabilityIndex: 65
  },
  {
    id: '3', areaId: '3', areaName: 'Velachery',
    congestionLevel: 'low', prediction30min: 'medium', prediction1hr: 'medium', prediction2hr: 'low', prediction3hr: 'low',
    currentSpeed: 42, vehicleDensity: 30, reason: 'Normal traffic flow', stabilityIndex: 82
  },
  {
    id: '4', areaId: '4', areaName: 'Adyar',
    congestionLevel: 'medium', prediction30min: 'high', prediction1hr: 'high', prediction2hr: 'medium', prediction3hr: 'medium',
    currentSpeed: 25, vehicleDensity: 60, reason: 'IT corridor traffic building up', stabilityIndex: 48
  },
  {
    id: '5', areaId: '5', areaName: 'Guindy',
    congestionLevel: 'high', prediction30min: 'high', prediction1hr: 'high', prediction2hr: 'high', prediction3hr: 'medium',
    currentSpeed: 8, vehicleDensity: 92, reason: 'Industrial zone peak hours', stabilityIndex: 22
  },
  {
    id: '6', areaId: '6', areaName: 'Egmore',
    congestionLevel: 'medium', prediction30min: 'medium', prediction1hr: 'low', prediction2hr: 'low', prediction3hr: 'low',
    currentSpeed: 32, vehicleDensity: 48, reason: 'Station area moderate traffic', stabilityIndex: 71
  },
  {
    id: '7', areaId: '7', areaName: 'Mylapore',
    congestionLevel: 'low', prediction30min: 'low', prediction1hr: 'medium', prediction2hr: 'low', prediction3hr: 'low',
    currentSpeed: 45, vehicleDensity: 25, reason: 'Clear roads', stabilityIndex: 88
  },
  {
    id: '8', areaId: '8', areaName: 'Tambaram',
    congestionLevel: 'medium', prediction30min: 'high', prediction1hr: 'high', prediction2hr: 'medium', prediction3hr: 'low',
    currentSpeed: 22, vehicleDensity: 62, reason: 'Suburban rush hour approaching', stabilityIndex: 45
  },
  {
    id: '9', areaId: '9', areaName: 'Porur',
    congestionLevel: 'high', prediction30min: 'high', prediction1hr: 'medium', prediction2hr: 'medium', prediction3hr: 'low',
    currentSpeed: 15, vehicleDensity: 78, reason: 'Junction congestion', stabilityIndex: 28
  },
  {
    id: '10', areaId: '10', areaName: 'Perungudi',
    congestionLevel: 'medium', prediction30min: 'medium', prediction1hr: 'high', prediction2hr: 'medium', prediction3hr: 'low',
    currentSpeed: 30, vehicleDensity: 52, reason: 'IT park exit traffic', stabilityIndex: 55
  },
  {
    id: '11', areaId: '11', areaName: 'OMR',
    congestionLevel: 'high', prediction30min: 'high', prediction1hr: 'high', prediction2hr: 'high', prediction3hr: 'medium',
    currentSpeed: 10, vehicleDensity: 88, reason: 'IT corridor heavy traffic', stabilityIndex: 18
  },
  {
    id: '12', areaId: '12', areaName: 'ECR',
    congestionLevel: 'low', prediction30min: 'low', prediction1hr: 'low', prediction2hr: 'medium', prediction3hr: 'medium',
    currentSpeed: 55, vehicleDensity: 20, reason: 'Coastal route clear', stabilityIndex: 92
  },
];

export const analyticsData: AnalyticsData[] = [
  { hour: 6, avgSpeed: 45, congestionFrequency: 15, predictionAccuracy: 92 },
  { hour: 7, avgSpeed: 38, congestionFrequency: 35, predictionAccuracy: 89 },
  { hour: 8, avgSpeed: 22, congestionFrequency: 72, predictionAccuracy: 85 },
  { hour: 9, avgSpeed: 18, congestionFrequency: 85, predictionAccuracy: 88 },
  { hour: 10, avgSpeed: 28, congestionFrequency: 55, predictionAccuracy: 91 },
  { hour: 11, avgSpeed: 35, congestionFrequency: 40, predictionAccuracy: 90 },
  { hour: 12, avgSpeed: 32, congestionFrequency: 48, predictionAccuracy: 87 },
  { hour: 13, avgSpeed: 30, congestionFrequency: 52, predictionAccuracy: 86 },
  { hour: 14, avgSpeed: 34, congestionFrequency: 42, predictionAccuracy: 89 },
  { hour: 15, avgSpeed: 28, congestionFrequency: 58, predictionAccuracy: 88 },
  { hour: 16, avgSpeed: 22, congestionFrequency: 70, predictionAccuracy: 84 },
  { hour: 17, avgSpeed: 15, congestionFrequency: 88, predictionAccuracy: 82 },
  { hour: 18, avgSpeed: 12, congestionFrequency: 95, predictionAccuracy: 85 },
  { hour: 19, avgSpeed: 18, congestionFrequency: 78, predictionAccuracy: 87 },
  { hour: 20, avgSpeed: 28, congestionFrequency: 52, predictionAccuracy: 90 },
  { hour: 21, avgSpeed: 38, congestionFrequency: 30, predictionAccuracy: 92 },
  { hour: 22, avgSpeed: 48, congestionFrequency: 18, predictionAccuracy: 94 },
];

export const routeOptions: RouteData[] = [
  {
    id: '1', name: 'Via Inner Ring Road',
    distanceKm: 12.5, estimatedTimeMins: 35,
    congestionLevel: 'low', stabilityIndex: 85,
    futureRisk: 'low', delayProbability: 12
  },
  {
    id: '2', name: 'Via OMR Expressway',
    distanceKm: 15.2, estimatedTimeMins: 28,
    congestionLevel: 'medium', stabilityIndex: 62,
    futureRisk: 'medium', delayProbability: 35
  },
  {
    id: '3', name: 'Via Mount Road',
    distanceKm: 10.8, estimatedTimeMins: 45,
    congestionLevel: 'high', stabilityIndex: 28,
    futureRisk: 'high', delayProbability: 68
  },
];

// Chat responses for demo
export const chatResponses: Record<string, string> = {
  default: "I can help you with traffic information for this city. You can ask about congestion levels, best routes, predicted traffic conditions, or traffic stability for specific areas.",
  congestion: "Based on current data, the highest congestion is in Guindy (92 vehicles/km) and OMR (88 vehicles/km). T. Nagar also shows heavy traffic due to peak shopping hours. Lower congestion areas include ECR and Mylapore.",
  route: "For the best route, I'd recommend using Inner Ring Road which has a stability index of 85% and only 12% delay probability. While OMR is faster in distance, it currently has medium congestion with 35% delay risk.",
  prediction: "Looking at the next 3 hours: Guindy and OMR will remain congested. T. Nagar should improve after 2 hours. Anna Nagar expects increased traffic in the next hour due to school dismissal times.",
  stability: "The most stable routes today are: ECR (92% stability), Mylapore (88%), and Inner Ring Road (85%). Avoid OMR and Guindy for reliability as they have stability indices below 30%.",
  peak: "Peak hours are typically 8-10 AM and 5-7 PM. Current highest impact areas during peaks: Guindy Industrial Zone, OMR IT Corridor, and T. Nagar Shopping District.",
  weather: "Weather conditions are clear today with no expected impact on traffic. During monsoon season, low-lying areas like Velachery and Adyar typically see increased congestion due to waterlogging.",
};
