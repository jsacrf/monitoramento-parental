"use client";

import { useState, useEffect } from "react";
import { KidsLoginScreen } from "../components/KidsLoginScreen";
import { KidsDashboard } from "../components/KidsDashboard";

export default function KidsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [childId, setChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se criança já está logada
    const storedChildId = localStorage.getItem("parentalPro_kids_session");
    if (storedChildId) {
      setChildId(storedChildId);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (id: string) => {
    setChildId(id);
    setIsAuthenticated(true);
    localStorage.setItem("parentalPro_kids_session", id);
  };

  const handleLogout = () => {
    localStorage.removeItem("parentalPro_kids_session");
    setChildId(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
        <div className="text-lg text-purple-200">Carregando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
      {!isAuthenticated || !childId ? (
        <KidsLoginScreen onLogin={handleLogin} />
      ) : (
        <KidsDashboard childId={childId} onLogout={handleLogout} />
      )}
    </main>
  );
}
