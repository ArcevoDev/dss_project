import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/*
          Sonner toast portal — mounted outside <App> so toasts appear
          above all page content and are not clipped by any overflow containers.
          richColors maps to our design system palette automatically.
        */}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);