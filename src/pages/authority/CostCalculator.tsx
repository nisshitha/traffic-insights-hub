import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Fuel, Clock, Leaf, DollarSign, Car, TrendingUp } from 'lucide-react';

const AuthorityCostCalculator = () => {
  const [vehicles, setVehicles] = useState<string>('1000');
  const [avgDelay, setAvgDelay] = useState<string>('15');
  const [congestionLevel, setCongestionLevel] = useState<string>('medium');
  const [calculated, setCalculated] = useState(false);

  // Cost calculation factors (demo values)
  const FUEL_COST_PER_LITER = 105; // INR
  const IDLE_FUEL_CONSUMPTION = 0.8; // liters per hour
  const AVG_HOURLY_WAGE = 250; // INR
  const CO2_PER_LITER = 2.31; // kg CO2 per liter of petrol

  const vehicleCount = parseInt(vehicles) || 0;
  const delayMins = parseInt(avgDelay) || 0;
  const delayHours = delayMins / 60;

  // Congestion multiplier
  const congestionMultiplier = congestionLevel === 'high' ? 1.5 : congestionLevel === 'medium' ? 1.0 : 0.5;

  // Calculations
  const fuelWasted = vehicleCount * delayHours * IDLE_FUEL_CONSUMPTION * congestionMultiplier;
  const fuelCost = fuelWasted * FUEL_COST_PER_LITER;
  const timeLost = vehicleCount * delayMins;
  const timeCost = vehicleCount * delayHours * AVG_HOURLY_WAGE;
  const carbonEmissions = fuelWasted * CO2_PER_LITER;
  const totalEconomicCost = fuelCost + timeCost;

  // Daily/Monthly/Yearly projections
  const dailyCost = totalEconomicCost;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;

  const handleCalculate = () => {
    setCalculated(true);
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(2)} K`;
    return `₹${value.toFixed(2)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar role="authority" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Congestion Cost Calculator</h1>
          <p className="text-muted-foreground">Estimate fuel wastage, time loss, and carbon emissions from traffic congestion</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-accent" />
                Input Parameters
              </CardTitle>
              <CardDescription>Configure congestion scenario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicles">Affected Vehicles</Label>
                <Input
                  id="vehicles"
                  type="number"
                  value={vehicles}
                  onChange={(e) => setVehicles(e.target.value)}
                  placeholder="Number of vehicles"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delay">Average Delay (minutes)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={avgDelay}
                  onChange={(e) => setAvgDelay(e.target.value)}
                  placeholder="Delay in minutes"
                />
              </div>

              <div className="space-y-2">
                <Label>Congestion Level</Label>
                <Select value={congestionLevel} onValueChange={setCongestionLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleCalculate}>
                Calculate Costs
              </Button>

              {/* Assumptions */}
              <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                <p className="font-medium">Assumptions:</p>
                <p>• Fuel cost: ₹{FUEL_COST_PER_LITER}/L</p>
                <p>• Idle consumption: {IDLE_FUEL_CONSUMPTION} L/hr</p>
                <p>• Avg hourly wage: ₹{AVG_HOURLY_WAGE}</p>
                <p>• CO2 emission: {CO2_PER_LITER} kg/L</p>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!calculated ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter parameters and click Calculate</p>
                  <p className="text-sm mt-2">See economic & environmental impact</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Main Impact Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <Fuel className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-amber-700">Fuel Wasted</p>
                          <p className="text-xl font-bold text-amber-800">{formatNumber(fuelWasted)} L</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">Time Lost</p>
                          <p className="text-xl font-bold text-blue-800">{formatNumber(timeLost)} mins</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-green-700">CO2 Emissions</p>
                          <p className="text-xl font-bold text-green-800">{formatNumber(carbonEmissions)} kg</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-red-700">Economic Cost</p>
                          <p className="text-xl font-bold text-red-800">{formatCurrency(totalEconomicCost)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cost Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4 text-muted-foreground" />
                          <span>Fuel Cost</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(fuelCost)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Time Value (Productivity Loss)</span>
                        </div>
                        <span className="font-semibold">{formatCurrency(timeCost)}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Total Economic Impact</span>
                        </div>
                        <span className="text-xl font-bold text-primary">{formatCurrency(totalEconomicCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Projections */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Projected Impact (If Unaddressed)</CardTitle>
                    <CardDescription>Cumulative costs over time at current congestion levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted text-center">
                        <p className="text-sm text-muted-foreground mb-1">Daily</p>
                        <p className="text-2xl font-bold">{formatCurrency(dailyCost)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatNumber(fuelWasted)} L fuel</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted text-center">
                        <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                        <p className="text-2xl font-bold">{formatCurrency(monthlyCost)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatNumber(fuelWasted * 30)} L fuel</p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/10 border-2 border-accent text-center">
                        <p className="text-sm text-accent mb-1">Yearly</p>
                        <p className="text-2xl font-bold text-accent">{formatCurrency(yearlyCost)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatNumber(carbonEmissions * 365)} kg CO2</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Summary */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                      <Leaf className="h-5 w-5" />
                      Environmental Impact Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-green-700">Daily Carbon Footprint:</p>
                        <p className="font-semibold text-green-800">{formatNumber(carbonEmissions)} kg CO2</p>
                        <p className="text-xs text-green-600 mt-1">
                          Equivalent to {Math.round(carbonEmissions / 21)} trees needed to offset
                        </p>
                      </div>
                      <div>
                        <p className="text-green-700">Annual Carbon Impact:</p>
                        <p className="font-semibold text-green-800">{formatNumber(carbonEmissions * 365)} kg CO2</p>
                        <p className="text-xs text-green-600 mt-1">
                          Equivalent to {Math.round((carbonEmissions * 365) / 21)} trees annually
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthorityCostCalculator;
