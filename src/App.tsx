import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Citizen Pages
import CitizenCongestion from "./pages/citizen/Congestion";
import CitizenRoute from "./pages/citizen/RouteRecommendation";
import CitizenAssistant from "./pages/citizen/Assistant";

// Authority Pages
import AuthorityMap from "./pages/authority/Map";
import AuthorityAnalytics from "./pages/authority/Analytics";
import AuthorityHelper from "./pages/authority/Helper";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'citizen' | 'authority' }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to their correct dashboard
    return <Navigate to={role === 'authority' ? '/authority/map' : '/citizen/congestion'} replace />;
  }

  return <>{children}</>;
};

// Auth Redirect Component
const AuthRedirect = () => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && role) {
    return <Navigate to={role === 'authority' ? '/authority/map' : '/citizen/congestion'} replace />;
  }

  return <Auth />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<AuthRedirect />} />

      {/* Citizen Routes */}
      <Route path="/citizen/congestion" element={
        <ProtectedRoute allowedRole="citizen">
          <CitizenCongestion />
        </ProtectedRoute>
      } />
      <Route path="/citizen/route" element={
        <ProtectedRoute allowedRole="citizen">
          <CitizenRoute />
        </ProtectedRoute>
      } />
      <Route path="/citizen/assistant" element={
        <ProtectedRoute allowedRole="citizen">
          <CitizenAssistant />
        </ProtectedRoute>
      } />

      {/* Authority Routes */}
      <Route path="/authority/map" element={
        <ProtectedRoute allowedRole="authority">
          <AuthorityMap />
        </ProtectedRoute>
      } />
      <Route path="/authority/analytics" element={
        <ProtectedRoute allowedRole="authority">
          <AuthorityAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/authority/helper" element={
        <ProtectedRoute allowedRole="authority">
          <AuthorityHelper />
        </ProtectedRoute>
      } />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
