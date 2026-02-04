import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Shield, Car, Route, Brain, BarChart3, ArrowRight, Activity, Calculator, TrendingUp, Leaf } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-citizen flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">UMIS</span>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Content */}
        <section className="py-16 md:py-24 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Urban Mobility<br />
            <span className="text-primary">Intelligence System</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Advanced traffic congestion prediction, smart route recommendations, 
            and AI-powered insights for smarter urban mobility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/citizen/congestion">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Users className="h-5 w-5" />
                Enter as Citizen
              </Button>
            </Link>
            <Link to="/authority/map">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Shield className="h-5 w-5" />
                Enter as Authority
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Platform Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Citizen Features */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl gradient-citizen flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">For Citizens</CardTitle>
                <CardDescription>Navigate city streets with confidence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Traffic Congestion Prediction</h4>
                    <p className="text-sm text-muted-foreground">Predicts low, medium, and high congestion levels before they occur</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Spatiotemporal Road Network</h4>
                    <p className="text-sm text-muted-foreground">Time-aware network to track traffic evolution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Route className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Smart Route Recommendation</h4>
                    <p className="text-sm text-muted-foreground">Routes based on predicted delay and future risk</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Traffic Stability Index</h4>
                    <p className="text-sm text-muted-foreground">Identifies reliable routes less prone to sudden congestion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Conversational Traffic Assistant</h4>
                    <p className="text-sm text-muted-foreground">Ask any question and get intelligent responses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authority Features */}
            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl gradient-authority flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">For Authorities</CardTitle>
                <CardDescription>Manage city traffic effectively</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Live Congestion Map</h4>
                    <p className="text-sm text-muted-foreground">Real-time visualization with color-coded roads</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Route Analytics Dashboard</h4>
                    <p className="text-sm text-muted-foreground">Charts, graphs, and performance metrics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calculator className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Congestion Cost Calculator</h4>
                    <p className="text-sm text-muted-foreground">Fuel wastage, time loss, and carbon emissions estimates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Environmental Impact Analysis</h4>
                    <p className="text-sm text-muted-foreground">Convert congestion into economic & environmental costs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">AI Decision Helper</h4>
                    <p className="text-sm text-muted-foreground">Ask about routes, congestion, and reliability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12">
              <h2 className="font-display text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                Choose your role and explore the smart traffic management system 
                for better urban mobility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/citizen/congestion">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Users className="h-5 w-5" />
                    Citizen Portal
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/authority/map">
                  <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    <Shield className="h-5 w-5" />
                    Authority Portal
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 UMIS - Urban Mobility Intelligence System. Smart mobility for smarter cities.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
