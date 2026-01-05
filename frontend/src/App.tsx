import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CropProvider } from "@/contexts/CropContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Alerts from "./pages/Alerts";
import Recommendations from "./pages/Recommendations";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CropProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/history" element={<ProtectedRoute element={<History />} />} />
              <Route path="/alerts" element={<ProtectedRoute element={<Alerts />} />} />
              <Route path="/recommendations" element={<ProtectedRoute element={<Recommendations />} />} />
              <Route path="/chatbot" element={<ProtectedRoute element={<Chatbot />} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CropProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
