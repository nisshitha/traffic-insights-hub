import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Citizen Pages
import CitizenCongestion from "./pages/citizen/Congestion";
import CitizenRoute from "./pages/citizen/RouteRecommendation";
import CitizenAssistant from "./pages/citizen/Assistant";
import CitizenStability from "./pages/citizen/Stability";

// Authority Pages
import AuthorityMap from "./pages/authority/Map";
import AuthorityAnalytics from "./pages/authority/Analytics";
import AuthorityHelper from "./pages/authority/Helper";
import AuthorityCostCalculator from "./pages/authority/CostCalculator";

const queryClient = new QueryClient();

// Simple role context for demo navigation
interface AppContextType {
  userRole: 'citizen' | 'authority' | null;
  setUserRole: (role: 'citizen' | 'authority' | null) => void;
}

export const AppContext = createContext<AppContextType>({
  userRole: null,
  setUserRole: () => {}
});

export const useAppContext = () => useContext(AppContext);

const App = () => {
  const [userRole, setUserRole] = useState<'citizen' | 'authority' | null>(null);

  return (
    <AppContext.Provider value={{ userRole, setUserRole }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />

              {/* Citizen Routes */}
              <Route path="/citizen/congestion" element={<CitizenCongestion />} />
              <Route path="/citizen/route" element={<CitizenRoute />} />
              <Route path="/citizen/assistant" element={<CitizenAssistant />} />
              <Route path="/citizen/stability" element={<CitizenStability />} />

              {/* Authority Routes */}
              <Route path="/authority/map" element={<AuthorityMap />} />
              <Route path="/authority/analytics" element={<AuthorityAnalytics />} />
              <Route path="/authority/helper" element={<AuthorityHelper />} />
              <Route path="/authority/cost-calculator" element={<AuthorityCostCalculator />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default App;
