import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { sendEvent } from "@/lib/logger";
import Index from "./pages/Index";
import Curriculum from "./pages/Curriculum";
import Learn from "./pages/Learn";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    void sendEvent("page_view", {
      path: location.pathname,
      search: location.search,
      referrer: document.referrer || null,
    });
  }, [location.pathname, location.search]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteChangeTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/learn/:curriculumId/:day" element={<Learn />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
