
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Widgets from "./pages/Widgets";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import SignUpScreen from "./components/onboarding/steps/SignUpStep";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/sidebar/AppSidebar";

const queryClient = new QueryClient();

// Layout component that wraps authenticated routes with sidebar
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">Atlas</h1>
          </div>
          {children}
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page as root route */}
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />
          
          {/* Authenticated routes with sidebar layout */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/widgets" element={<AppLayout><Widgets /></AppLayout>} />
          <Route path="/customers" element={<AppLayout><Customers /></AppLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
