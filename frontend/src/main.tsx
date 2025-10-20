import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 1) import the provider
import { AuthProvider } from "./auth/useAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 2) wrap your app here */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
