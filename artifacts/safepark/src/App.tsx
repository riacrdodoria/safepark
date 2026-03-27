import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import LoginPage from "@/pages/login";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import CamerasPage from "@/pages/cameras/index";
import AddCameraPage from "@/pages/cameras/add";
import EventsPage from "@/pages/events/index";
import EventDetailPage from "@/pages/events/detail";
import MapPage from "@/pages/map";
import TrackingPage from "@/pages/tracking";
import ContinuityPage from "@/pages/continuity";
import RulesPage from "@/pages/rules";
import UnitsPage from "@/pages/units";
import SettingsPage from "@/pages/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/landing" component={LandingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      
      <Route path="/cameras" component={CamerasPage} />
      <Route path="/cameras/add" component={AddCameraPage} />
      
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetailPage} />
      
      <Route path="/map" component={MapPage} />
      <Route path="/tracking" component={TrackingPage} />
      <Route path="/continuity" component={ContinuityPage} />
      <Route path="/rules" component={RulesPage} />
      <Route path="/units" component={UnitsPage} />
      <Route path="/settings" component={SettingsPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
