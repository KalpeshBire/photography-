import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import Rentals from "./pages/Rentals";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageGallery from "./pages/ManageGallery";
import ManageServices from "./pages/ManageServices";
import ManageRentals from "./pages/ManageRentals";
import ProtectedRoute from "./components/ProtectedRoute";

import { useState, useEffect } from "react";

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
    });
  };

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/services" element={<Services />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gallery" 
            element={
              <ProtectedRoute>
                <ManageGallery />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/services" 
            element={
              <ProtectedRoute>
                <ManageServices />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/rentals" 
            element={
              <ProtectedRoute>
                <ManageRentals />
              </ProtectedRoute>
            } 
          />
        </Routes>
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              padding: "10px 20px",
              backgroundColor: "#0f172a",
              color: "white",
              border: "none",
              borderRadius: "5px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              zIndex: 1000,
              cursor: "pointer",
            }}
          >
            Install App
          </button>
        )}
      </MainLayout>
    </BrowserRouter>
  );
}
