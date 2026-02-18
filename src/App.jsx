import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Cats from "./components/Cats";
import { checkAuth } from "./services/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticated = await checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "var(--text-primary)",
        }}
      >
        Загрузка...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/cats" replace /> : <Auth />}
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/cats" replace />
          ) : (
            <Auth initialTab="login" />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/cats" replace />
          ) : (
            <Auth initialTab="register" />
          )
        }
      />
      <Route
        path="/cats"
        element={isAuthenticated ? <Cats /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/cats" : "/auth"} replace />}
      />
    </Routes>
  );
}

export default App;
