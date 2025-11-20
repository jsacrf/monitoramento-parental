"use client";

import { useState, useEffect } from "react";
import { Child } from "../types";
import { Smile } from "lucide-react";

interface KidsLoginScreenProps {
  onLogin: (childId: string) => void;
}

export function KidsLoginScreen({ onLogin }: KidsLoginScreenProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = () => {
    const stored = localStorage.getItem("parentalPro_children");
    if (stored) {
      setChildren(JSON.parse(stored));
    }
  };

  const handleLogin = () => {
    if (selectedChild) {
      onLogin(selectedChild);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Smile className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
              ParentalPro Kids
            </h1>
            <p className="text-purple-200/80 text-sm">
              Escolha seu perfil para entrar
            </p>
          </div>

          {/* Seleção de Criança */}
          {children.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-purple-200/80 mb-4">
                Nenhum perfil encontrado.
              </p>
              <p className="text-purple-200/60 text-sm">
                Peça para seus pais criarem um perfil para você!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`w-full p-4 rounded-2xl transition-all duration-200 flex items-center gap-3 ${
                      selectedChild === child.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                        : "bg-white/10 text-purple-200 hover:bg-white/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                      selectedChild === child.id
                        ? "bg-white/20"
                        : "bg-white/10"
                    }`}>
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{child.name}</p>
                      <p className={`text-sm ${
                        selectedChild === child.id ? "text-white/80" : "text-purple-200/60"
                      }`}>
                        {child.age} anos
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleLogin}
                disabled={!selectedChild}
                className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:scale-105 disabled:hover:scale-100"
              >
                Entrar
              </button>
            </>
          )}
        </div>

        {/* Link para versão dos pais */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-purple-200/80 hover:text-purple-200 text-sm underline transition-colors"
          >
            Acessar versão dos pais
          </a>
        </div>
      </div>
    </div>
  );
}
