"use client";

import { useState, useEffect } from "react";
import { LogOut, Clock, Smartphone, Calendar, AlertCircle, CheckCircle, Crown, Lock } from "lucide-react";
import { Child } from "../types";

interface KidsDashboardProps {
  childId: string;
  onLogout: () => void;
}

export function KidsDashboard({ childId, onLogout }: KidsDashboardProps) {
  const [child, setChild] = useState<Child | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userPlan, setUserPlan] = useState<"beta" | "premium">("beta");

  useEffect(() => {
    loadChild();
    loadUserPlan();
    const interval = setInterval(() => {
      loadChild();
      setCurrentTime(new Date());
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [childId]);

  const loadChild = () => {
    const stored = localStorage.getItem("parentalPro_children");
    if (stored) {
      const children: Child[] = JSON.parse(stored);
      const foundChild = children.find((c) => c.id === childId);
      if (foundChild) {
        setChild(foundChild);
      }
    }
  };

  const loadUserPlan = () => {
    const plan = localStorage.getItem("parentalPro_plan");
    if (plan === "premium" || plan === "beta") {
      setUserPlan(plan);
    }
  };

  if (!child) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-purple-200">Carregando...</div>
      </div>
    );
  }

  const timeRemaining = Math.max(0, child.timeLimit - child.screenTime);
  const isOverLimit = child.screenTime > child.timeLimit;
  const progressPercentage = Math.min(100, (child.screenTime / child.timeLimit) * 100);

  // Filtrar apps bloqueados - com verificação de segurança
  const childApps = Array.isArray(child.apps) ? child.apps : [];
  const blockedApps = childApps.filter(app => app.blocked || app.timeUsed >= app.timeLimit);
  const allowedApps = childApps.filter(app => !app.blocked && app.timeUsed < app.timeLimit);

  // Rotina atual - com verificação de segurança
  const currentHour = currentTime.getHours();
  const childRoutines = Array.isArray(child.routines) ? child.routines : [];
  const currentRoutine = childRoutines.find(routine => {
    const [startHour] = routine.time.split(':').map(Number);
    const endHour = startHour + 1; // Assumindo 1 hora de duração
    return currentHour >= startHour && currentHour < endHour;
  });

  // Verificar se funcionalidade está disponível no plano
  const isPremiumFeature = (feature: "routines" | "detailedReports" | "advancedFilters") => {
    return userPlan === "beta";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Olá, {child.name}! 👋
                </h1>
                {userPlan === "premium" && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1">
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">PREMIUM</span>
                  </div>
                )}
                {userPlan === "beta" && (
                  <div className="bg-blue-500 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-white">BETA</span>
                  </div>
                )}
              </div>
              <p className="text-purple-200/80 text-sm">
                Bem-vindo ao seu painel
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200 font-medium border border-white/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sair</span>
            </button>
          </div>
        </div>

        {/* Tempo de Tela */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isOverLimit 
                ? 'bg-gradient-to-br from-red-500 to-orange-600' 
                : 'bg-gradient-to-br from-purple-500 to-pink-600'
            }`}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Tempo de Tela</h2>
              <p className="text-purple-200/80 text-sm">
                {isOverLimit ? 'Limite ultrapassado!' : 'Acompanhe seu uso'}
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-purple-200/80 mb-2">
              <span>Usado: {child.screenTime} min</span>
              <span>Limite: {child.timeLimit} min</span>
            </div>
            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isOverLimit
                    ? 'bg-gradient-to-r from-red-500 to-orange-600'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Tempo Restante */}
          <div className={`p-4 rounded-2xl ${
            isOverLimit 
              ? 'bg-red-500/20 border border-red-500/30' 
              : 'bg-green-500/20 border border-green-500/30'
          }`}>
            <p className="text-center text-white font-semibold">
              {isOverLimit 
                ? `⚠️ Você ultrapassou o limite em ${child.screenTime - child.timeLimit} minutos`
                : `✅ Você ainda tem ${timeRemaining} minutos disponíveis`
              }
            </p>
          </div>
        </div>

        {/* Rotina Atual - PREMIUM ONLY */}
        {isPremiumFeature("routines") ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Rotinas Personalizadas</h2>
                    <p className="text-purple-200/80 text-sm">Recurso Premium</p>
                  </div>
                </div>
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="bg-white/10 p-4 rounded-2xl text-center">
                <p className="text-white font-semibold mb-2">🔒 Funcionalidade Bloqueada</p>
                <p className="text-purple-200/80 text-sm mb-4">
                  Faça upgrade para Premium e tenha acesso a rotinas personalizadas!
                </p>
                <button
                  onClick={() => window.location.href = "/checkout"}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </div>
        ) : (
          currentRoutine && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Rotina Atual</h2>
                  <p className="text-purple-200/80 text-sm">{currentRoutine.time}</p>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-white font-semibold mb-2">{currentRoutine.title}</p>
                <p className="text-purple-200/80 text-sm">{currentRoutine.description}</p>
              </div>
            </div>
          )
        )}

        {/* Apps Disponíveis */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Apps Disponíveis</h2>
              <p className="text-purple-200/80 text-sm">{allowedApps.length} apps liberados</p>
            </div>
          </div>

          {allowedApps.length === 0 ? (
            <div className="text-center py-8 text-purple-200/60">
              Nenhum app disponível no momento
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allowedApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white/10 p-4 rounded-2xl text-center hover:bg-white/20 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{app.name}</p>
                  <p className="text-purple-200/60 text-xs">
                    {app.timeUsed}/{app.timeLimit} min
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Apps Bloqueados */}
        {blockedApps.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Apps Bloqueados</h2>
                <p className="text-purple-200/80 text-sm">{blockedApps.length} apps indisponíveis</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {blockedApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-red-500/20 p-4 rounded-2xl text-center border border-red-500/30"
                >
                  <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-6 h-6 text-red-300" />
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">{app.name}</p>
                  <p className="text-red-200/80 text-xs">
                    {app.blocked ? 'Bloqueado' : 'Limite atingido'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Relatórios Detalhados - PREMIUM ONLY */}
        {isPremiumFeature("detailedReports") && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Relatórios Detalhados</h2>
                    <p className="text-purple-200/80 text-sm">Recurso Premium</p>
                  </div>
                </div>
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="bg-white/10 p-4 rounded-2xl text-center">
                <p className="text-white font-semibold mb-2">🔒 Funcionalidade Bloqueada</p>
                <p className="text-purple-200/80 text-sm mb-4">
                  Acesse relatórios completos sobre atividades e uso de apps com o plano Premium!
                </p>
                <button
                  onClick={() => window.location.href = "/checkout"}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Fazer Upgrade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
