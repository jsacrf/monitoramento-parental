"use client";

import { useState, useEffect } from "react";
import { LogOut, Plus, Users, Clock, TrendingUp, Smartphone } from "lucide-react";
import { AddChildModal } from "./AddChildModal";
import { ChildCard } from "./ChildCard";
import { Child } from "../types";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = () => {
    const stored = localStorage.getItem("parentalPro_children");
    if (stored) {
      setChildren(JSON.parse(stored));
    }
  };

  const handleAddChild = (name: string, age: number, timeLimit: number) => {
    const newChild: Child = {
      id: Date.now().toString(),
      name,
      age,
      timeLimit,
      screenTime: 0,
      lastUpdated: new Date().toISOString(),
      apps: [],
      routines: [],
      searchAlerts: [],
      location: undefined,
      callLogs: [],
      messages: [],
    };

    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
    setIsModalOpen(false);
  };

  const handleUpdateScreenTime = (childId: string, minutes: number) => {
    const updatedChildren = children.map((child) => {
      if (child.id === childId) {
        const newScreenTime = child.screenTime + minutes;
        
        // Verificar se ultrapassou o limite e mostrar alerta
        if (newScreenTime > child.timeLimit && child.screenTime <= child.timeLimit) {
          setTimeout(() => {
            alert(`⚠️ ALERTA: ${child.name} ultrapassou o limite de tempo de tela!\n\nTempo atual: ${newScreenTime} minutos\nLimite: ${child.timeLimit} minutos`);
          }, 100);
        }

        return {
          ...child,
          screenTime: newScreenTime,
          lastUpdated: new Date().toISOString(),
        };
      }
      return child;
    });

    setChildren(updatedChildren);
    localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
  };

  const handleResetScreenTime = (childId: string) => {
    const updatedChildren = children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          screenTime: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
      return child;
    });

    setChildren(updatedChildren);
    localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
  };

  const handleDeleteChild = (childId: string) => {
    if (confirm("Tem certeza que deseja remover este filho?")) {
      const updatedChildren = children.filter((child) => child.id !== childId);
      setChildren(updatedChildren);
      localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
    }
  };

  const handleUpdateApps = (childId: string, apps: Child['apps']) => {
    const updatedChildren = children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          apps,
          lastUpdated: new Date().toISOString(),
        };
      }
      return child;
    });

    setChildren(updatedChildren);
    localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
  };

  const handleUpdateRoutines = (childId: string, routines: Child['routines']) => {
    const updatedChildren = children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          routines,
          lastUpdated: new Date().toISOString(),
        };
      }
      return child;
    });

    setChildren(updatedChildren);
    localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
  };

  const handleUpdateSearchAlerts = (childId: string, searchAlerts: Child['searchAlerts']) => {
    const updatedChildren = children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          searchAlerts,
          lastUpdated: new Date().toISOString(),
        };
      }
      return child;
    });

    setChildren(updatedChildren);
    localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
  };

  const handleUpdateCommunication = (childId: string, callLogs: Child['callLogs'], messages: Child['messages']) => {
    const updatedChildren = children.map((child) => {
      if (child.id === childId) {
        return {
          ...child,
          callLogs,
          messages,
          lastUpdated: new Date().toISOString(),
        };
      }
      return child;
    });

    setChildren(updatedChildren);
    localStorage.setItem("parentalPro_children", JSON.stringify(updatedChildren));
  };

  // Calcular estatísticas
  const totalChildren = children.length;
  const totalScreenTime = children.reduce((acc, child) => acc + child.screenTime, 0);
  const childrenOverLimit = children.filter(child => child.screenTime > child.timeLimit).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Efeitos de fundo tecnológico */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d6af2c28-ec7a-413b-8465-468da050b096.jpg" 
                  alt="ParentalPro Logo" 
                  className="h-14 w-14 rounded-2xl shadow-lg object-cover"
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    ParentalPro
                  </h1>
                  <p className="text-cyan-200/80 text-sm font-medium">
                    Controle Parental Inteligente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Link para versão Kids */}
                <a
                  href="/kids"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-sm">Versão Kids</span>
                </a>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-5 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200 font-medium border border-white/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        {children.length > 0 && (
          <div className="max-w-7xl mx-auto mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total de Filhos */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200/80 font-medium">Total de Filhos</p>
                    <p className="text-2xl font-bold text-white">{totalChildren}</p>
                  </div>
                </div>
              </div>

              {/* Tempo Total */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200/80 font-medium">Tempo Total Hoje</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.floor(totalScreenTime / 60)}h {totalScreenTime % 60}min
                    </p>
                  </div>
                </div>
              </div>

              {/* Alertas */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    childrenOverLimit > 0 
                      ? 'bg-gradient-to-br from-red-500 to-orange-600' 
                      : 'bg-gradient-to-br from-green-500 to-emerald-600'
                  }`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-cyan-200/80 font-medium">Acima do Limite</p>
                    <p className="text-2xl font-bold text-white">{childrenOverLimit}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="max-w-7xl mx-auto">
          {/* Botão Adicionar Filho */}
          <div className="mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:scale-105"
            >
              <Plus className="w-6 h-6" />
              Adicionar Filho
            </button>
          </div>

          {/* Lista de Filhos */}
          {children.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/20">
                  <Plus className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Nenhum filho cadastrado
                </h3>
                <p className="text-cyan-200/80 mb-8 leading-relaxed">
                  Comece adicionando um filho para monitorar o tempo de tela e manter o controle parental
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 shadow-xl hover:scale-105"
                >
                  <Plus className="w-6 h-6" />
                  Adicionar Primeiro Filho
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onUpdateScreenTime={handleUpdateScreenTime}
                  onResetScreenTime={handleResetScreenTime}
                  onDelete={handleDeleteChild}
                  onUpdateApps={handleUpdateApps}
                  onUpdateRoutines={handleUpdateRoutines}
                  onUpdateSearchAlerts={handleUpdateSearchAlerts}
                  onUpdateCommunication={handleUpdateCommunication}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Adicionar Filho */}
        {isModalOpen && (
          <AddChildModal
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddChild}
          />
        )}
      </div>
    </div>
  );
}
