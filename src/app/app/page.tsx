'use client';

import { useState, useEffect } from 'react';
import { Shield, Clock, Smartphone, TrendingUp, Settings, Bell, Plus, Lock, ChevronRight, Home, BarChart3, User } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  screenTime: {
    today: number;
    limit: number;
  };
  apps: Array<{
    name: string;
    icon: string;
    time: number;
    blocked: boolean;
  }>;
  schedule: Array<{
    day: string;
    start: string;
    end: string;
  }>;
}

interface Plan {
  type: 'beta' | 'premium';
  name: string;
  features: string[];
}

export default function AppPage() {
  const [currentPlan, setCurrentPlan] = useState<Plan>({
    type: 'beta',
    name: 'Beta',
    features: ['Monitoramento básico', 'Até 2 dispositivos', 'Controle de tempo']
  });

  const [children, setChildren] = useState<Child[]>([
    {
      id: '1',
      name: 'Maria',
      age: 10,
      avatar: '👧',
      screenTime: {
        today: 145,
        limit: 180
      },
      apps: [
        { name: 'YouTube', icon: '📺', time: 65, blocked: false },
        { name: 'TikTok', icon: '🎵', time: 45, blocked: false },
        { name: 'WhatsApp', icon: '💬', time: 35, blocked: false }
      ],
      schedule: [
        { day: 'Segunda', start: '14:00', end: '18:00' },
        { day: 'Terça', start: '14:00', end: '18:00' }
      ]
    }
  ]);

  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'profile'>('home');

  const isPremium = currentPlan.type === 'premium';

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const progressPercentage = (selectedChild.screenTime.today / selectedChild.screenTime.limit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ParentalPro</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isPremium ? 'bg-yellow-400 text-yellow-900' : 'bg-white/30'}`}>
                {currentPlan.name}
              </span>
            </div>
          </div>
          <button className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-all">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Child Selector */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                selectedChild.id === child.id
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
              }`}
            >
              <span className="text-2xl">{child.avatar}</span>
              <div className="text-left">
                <p className="font-semibold text-sm">{child.name}</p>
                <p className="text-xs opacity-80">{child.age} anos</p>
              </div>
            </button>
          ))}
          <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Adicionar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {activeTab === 'home' && (
          <>
            {/* Screen Time Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-gray-800">Tempo de Tela Hoje</h2>
                </div>
                <button className="text-indigo-600 text-sm font-medium">Editar</button>
              </div>
              
              <div className="relative">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-4xl font-bold text-gray-800">{formatTime(selectedChild.screenTime.today)}</p>
                    <p className="text-sm text-gray-500">de {formatTime(selectedChild.screenTime.limit)}</p>
                  </div>
                  <div className={`text-right ${progressPercentage > 80 ? 'text-red-500' : 'text-green-500'}`}>
                    <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                    <p className="text-xs">usado</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      progressPercentage > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Apps Usage */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-gray-800">Apps Mais Usados</h2>
                </div>
                <button className="text-indigo-600 text-sm font-medium">Ver todos</button>
              </div>

              <div className="space-y-3">
                {selectedChild.apps.map((app, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{app.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{app.name}</p>
                        <p className="text-sm text-gray-500">{formatTime(app.time)}</p>
                      </div>
                    </div>
                    <button className={`p-2 rounded-lg transition-all ${
                      app.blocked 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features (Locked for Beta) */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-yellow-400 p-2 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-yellow-900" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">Desbloqueie Recursos Premium</h3>
                    <p className="text-sm text-gray-600">Relatórios detalhados, filtros avançados e muito mais!</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  Fazer Upgrade para Premium
                </button>
              </div>
            )}

            {/* Schedule (Premium Feature) */}
            {isPremium ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <h2 className="font-bold text-gray-800">Rotina Semanal</h2>
                  </div>
                  <button className="text-indigo-600 text-sm font-medium">Editar</button>
                </div>

                <div className="space-y-2">
                  {selectedChild.schedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                      <span className="font-medium text-gray-800">{item.day}</span>
                      <span className="text-sm text-gray-600">{item.start} - {item.end}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <Lock className="w-12 h-12 mx-auto mb-3" />
                    <p className="font-bold mb-1">Recurso Premium</p>
                    <p className="text-sm opacity-80">Faça upgrade para acessar</p>
                  </div>
                </div>
                <div className="blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800">Rotina Semanal</h2>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-indigo-50 rounded-xl h-12"></div>
                    <div className="p-3 bg-indigo-50 rounded-xl h-12"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-gray-800">Estatísticas</h2>
            </div>
            {!isPremium ? (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Relatórios detalhados disponíveis no plano Premium</p>
                <button 
                  onClick={() => window.location.href = '/checkout'}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Fazer Upgrade
                </button>
              </div>
            ) : (
              <p className="text-gray-600">Gráficos e relatórios detalhados aqui...</p>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-gray-800">Perfil</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Plano Atual</p>
                <p className="font-bold text-gray-800">{currentPlan.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">Recursos</p>
                <ul className="space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700">• {feature}</li>
                  ))}
                </ul>
              </div>
              {!isPremium && (
                <button 
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Upgrade para Premium
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 rounded-t-3xl shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Início</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'stats' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Estatísticas</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
