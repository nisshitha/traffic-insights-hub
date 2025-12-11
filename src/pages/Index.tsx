import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Shield, Car, Route, Brain, BarChart3, ArrowRight } from 'lucide-react';

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
            <span className="font-display font-bold text-xl">Chennai Traffic Hub</span>
          </div>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Content */}
        <section className="py-16 md:py-24 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Smart Traffic Management<br />
            <span className="text-primary">for Chennai</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Real-time congestion monitoring, intelligent route recommendations, 
            and AI-powered insights for smarter city mobility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/auth?role=citizen">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Users className="h-5 w-5" />
                I'm a Citizen
              </Button>
            </Link>
            <Link to="/auth?role=authority">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Shield className="h-5 w-5" />
                I'm an Authority
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Citizen Features */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl gradient-citizen flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">For Citizens</CardTitle>
                <CardDescription>Navigate Chennai streets with ease</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Congestion Prediction</h4>
                    <p className="text-sm text-muted-foreground">View current and 10-minute predicted traffic levels</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Route className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Route Recommendation</h4>
                    <p className="text-sm text-muted-foreground">Get the best route between any two Chennai areas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold">AI Assistant</h4>
                    <p className="text-sm text-muted-foreground">Ask questions about traffic conditions</p>
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
                    <h4 className="font-semibold">Visual Congestion Map</h4>
                    <p className="text-sm text-muted-foreground">Color-coded map with predicted hotspots</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Route Analytics</h4>
                    <p className="text-sm text-muted-foreground">Charts, graphs, and performance metrics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold">AI Decision Helper</h4>
                    <p className="text-sm text-muted-foreground">Smart insights for traffic management decisions</p>
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
                Join Chennai's smart traffic management system today and experience 
                hassle-free commuting.
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Chennai Traffic Hub. Smart mobility for a smarter city.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
