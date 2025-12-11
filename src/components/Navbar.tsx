import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu, X, MapPin, Route, MessageSquare, BarChart3, Brain } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const citizenLinks = [
    { href: '/citizen/congestion', label: 'Congestion', icon: MapPin },
    { href: '/citizen/route', label: 'Route', icon: Route },
    { href: '/citizen/assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  const authorityLinks = [
    { href: '/authority/map', label: 'Live Map', icon: MapPin },
    { href: '/authority/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/authority/helper', label: 'AI Helper', icon: Brain },
  ];

  const links = role === 'authority' ? authorityLinks : citizenLinks;
  const themeColor = role === 'authority' ? 'accent' : 'primary';

  if (!user) return null;

  return (
    <nav className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={role === 'authority' ? '/authority/map' : '/citizen/congestion'} className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              role === 'authority' ? 'gradient-authority' : 'gradient-citizen'
            )}>
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Chennai Traffic</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={location.pathname === link.href ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    location.pathname === link.href && role === 'authority' && 'bg-accent text-accent-foreground hover:bg-accent/90'
                  )}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Signed in as </span>
              <span className={cn(
                "font-medium capitalize",
                role === 'authority' ? 'text-accent' : 'text-primary'
              )}>
                {role}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={location.pathname === link.href ? 'default' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button variant="outline" className="w-full justify-start" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
