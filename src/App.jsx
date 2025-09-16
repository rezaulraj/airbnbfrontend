import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import RootLayout from "./layout/RootLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./components/AuthPage";
import Profile from "./pages/admin/Profile";
import AuthSuccess from "./components/AuthSuccess";
import HostPage from "./pages/admin/HostPage";

function AppContent() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();

    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get("user");

    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        useAuthStore.getState().setUser(userData);

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (error) {
        console.error("Error parsing user data from URL:", error);
      }
    }
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/become-a-host" element={<HostPage />} />
      </Route>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
