
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Registration from "./pages/Registration";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

// Create a new QueryClient
const queryClient = new QueryClient();

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Check if the models directory exists in public
    // This would be a message for developers only
    fetch('/models/tiny_face_detector_model-weights_manifest.json')
      .then(response => {
        if (!response.ok) {
          console.warn(
            'Face detection models not found in public directory. ' +
            'Please make sure to create a "models" folder in your public directory ' +
            'and add the face-api.js models there. You can download them from ' +
            'https://github.com/justadudewhohacks/face-api.js/tree/master/weights'
          );
        } else {
          console.log('Face detection models found successfully');
        }
        setAppReady(true);
      })
      .catch(error => {
        console.error('Failed to check for face detection models:', error);
        setAppReady(true);
      });
  }, []);

  if (!appReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-4 border-t-brand-600 border-r-transparent border-b-brand-600 border-l-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="register" element={<Registration />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="reports" element={<Reports />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
