"use client";

import { useState } from "react";
import { X, Plus, Lock, Unlock, Clock, Gamepad2, MessageCircle, BookOpen, Film, Smartphone, AlertTriangle } from "lucide-react";
import { App } from "../types";

interface AppManagementModalProps {
  childName: string;
  apps: App[];
  onClose: () => void;
  onUpdateApps: (apps: App[]) => void;
}

const APP_CATEGORIES = [
  { value: 'game', label: 'Jogos', icon: Gamepad2, color: 'from-red-500 to-red-600' },
  { value: 'social', label: 'Redes Sociais', icon: MessageCircle, color: 'from-blue-500 to-blue-600' },
  { value: 'education', label: 'Educação', icon: BookOpen, color: 'from-green-500 to-green-600' },
  { value: 'entertainment', label: 'Entretenimento', icon: Film, color: 'from-purple-500 to-purple-600' },
  { value: 'other', label: 'Outros', icon: Smartphone, color: 'from-gray-500 to-gray-600' },
];

export function AppManagementModal({ childName, apps, onClose, onUpdateApps }: AppManagementModalProps) {
  const [localApps, setLocalApps] = useState<App[]>(apps);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [newAppCategory, setNewAppCategory] = useState<App['category']>('game');
  const [newAppTimeLimit, setNewAppTimeLimit] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<App['category'] | 'all'>('all');

  const handleAddApp = () => {
    if (!newAppName.trim()) return;

    const newApp: App = {
      id: Date.now().toString(),
      name: newAppName.trim(),
      category: newAppCategory,
      icon: getCategoryIcon(newAppCategory),
      isBlocked: false,
      timeLimit: newAppTimeLimit,
      timeUsed: 0,
    };

    setLocalApps([...localApps, newApp]);
    setNewAppName("");
    setNewAppCategory('game');
    setNewAppTimeLimit(undefined);
    setIsAddingApp(false);
  };

  const handleToggleBlock = (appId: string) => {
    setLocalApps(localApps.map(app => 
      app.id === appId ? { ...app, isBlocked: !app.isBlocked } : app
    ));
  };

  const handleUpdateTimeLimit = (appId: string, timeLimit: number | undefined) => {
    setLocalApps(localApps.map(app => 
      app.id === appId ? { ...app, timeLimit } : app
    ));
  };

  const handleUpdateTimeUsed = (appId: string, timeUsed: number) => {
    setLocalApps(localApps.map(app => {
      if (app.id === appId) {
        const newTimeUsed = timeUsed;
        // Bloqueio automático quando ultrapassar o limite
        const shouldAutoBlock = app.timeLimit !== undefined && newTimeUsed > app.timeLimit;
        
        if (shouldAutoBlock && !app.isBlocked) {
          // Mostrar alerta de bloqueio automático
          setTimeout(() => {
            alert(`🔒 BLOQUEIO AUTOMÁTICO\n\nO app "${app.name}" foi bloqueado automaticamente!\n\nTempo usado: ${newTimeUsed} minutos\nLimite: ${app.timeLimit} minutos\n\nO dispositivo está agora bloqueado para este app.`);
          }, 100);
        }

        return {
          ...app,
          timeUsed: newTimeUsed,
          isBlocked: shouldAutoBlock || app.isBlocked, // Mantém bloqueado se já estava ou se ultrapassou
        };
      }
      return app;
    }));
  };

  const handleDeleteApp = (appId: string) => {
    setLocalApps(localApps.filter(app => app.id !== appId));
  };

  const handleSave = () => {
    onUpdateApps(localApps);
    onClose();
  };

  const getCategoryIcon = (category: App['category']) => {
    const cat = APP_CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : 'App';
  };

  const getCategoryColor = (category: App['category']) => {
    const cat = APP_CATEGORIES.find(c => c.value === category);
    return cat ? cat.color : 'from-gray-500 to-gray-600';
  };

  const getCategoryIconComponent = (category: App['category']) => {
    const cat = APP_CATEGORIES.find(c => c.value === category);
    const IconComponent = cat ? cat.icon : Smartphone;
    return IconComponent;
  };

  const filteredApps = activeTab === 'all' 
    ? localApps 
    : localApps.filter(app => app.category === activeTab);

  // Verificar se há apps bloqueados automaticamente
  const autoBlockedApps = localApps.filter(app => 
    app.timeLimit !== undefined && app.timeUsed > app.timeLimit && app.isBlocked
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Gerenciar Apps e Jogos</h2>
              <p className="text-white/90 text-sm">Controle de {childName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Alerta de Bloqueio Automático */}
        {autoBlockedApps.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-800 mb-1">
                  {autoBlockedApps.length} app{autoBlockedApps.length > 1 ? 's' : ''} bloqueado{autoBlockedApps.length > 1 ? 's' : ''} automaticamente
                </h3>
                <p className="text-sm text-red-700">
                  {autoBlockedApps.map(app => app.name).join(', ')} ultrapassou o limite de tempo e foi bloqueado no dispositivo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <div className="flex min-w-max">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span>Todos ({localApps.length})</span>
              </div>
            </button>
            {APP_CATEGORIES.map((category) => {
              const count = localApps.filter(app => app.category === category.value).length;
              const IconComponent = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setActiveTab(category.value as App['category'])}
                  className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                    activeTab === category.value
                      ? "bg-white text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <IconComponent className="w-5 h-5" />
                    <span>{category.label} ({count})</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Botão Adicionar App */}
          {!isAddingApp && (
            <button
              onClick={() => setIsAddingApp(true)}
              className="w-full mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Adicionar App ou Jogo
            </button>
          )}

          {/* Formulário Adicionar App */}
          {isAddingApp && (
            <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Novo App/Jogo</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do App/Jogo
                  </label>
                  <input
                    type="text"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="Ex: Minecraft, Instagram, YouTube..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={newAppCategory}
                    onChange={(e) => setNewAppCategory(e.target.value as App['category'])}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    {APP_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Limite de Tempo Diário (opcional)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={newAppTimeLimit || ''}
                      onChange={(e) => setNewAppTimeLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Minutos por dia"
                      min="0"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => setNewAppTimeLimit(undefined)}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      Sem limite
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ⚠️ O app será bloqueado automaticamente ao ultrapassar o limite
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddApp}
                    disabled={!newAppName.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingApp(false);
                      setNewAppName("");
                      setNewAppCategory('game');
                      setNewAppTimeLimit(undefined);
                    }}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Apps */}
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-600 font-medium">
                {activeTab === 'all' 
                  ? 'Nenhum app cadastrado ainda' 
                  : `Nenhum app na categoria ${APP_CATEGORIES.find(c => c.value === activeTab)?.label}`
                }
              </p>
              <p className="text-gray-500 text-sm mt-1">Adicione apps e jogos para controlar o uso</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApps.map((app) => {
                const IconComponent = getCategoryIconComponent(app.category);
                const isOverLimit = app.timeLimit !== undefined && app.timeUsed > app.timeLimit;
                const percentUsed = app.timeLimit ? Math.min((app.timeUsed / app.timeLimit) * 100, 100) : 0;
                
                return (
                  <div
                    key={app.id}
                    className={`bg-white border-2 rounded-2xl p-4 transition-all duration-200 ${
                      app.isBlocked 
                        ? 'border-red-200 bg-red-50/50' 
                        : isOverLimit
                        ? 'border-orange-200 bg-orange-50/50'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Ícone */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(app.category)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>

                      {/* Informações */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-gray-800">{app.name}</h4>
                            <p className="text-sm text-gray-500">{app.icon}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Limite de Tempo */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Limite diário:</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={app.timeLimit || ''}
                              onChange={(e) => handleUpdateTimeLimit(app.id, e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="Sem limite"
                              min="0"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                            />
                            <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                              min/dia
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            ⚠️ Bloqueio automático ao ultrapassar
                          </p>
                        </div>

                        {/* Tempo Usado (Simulador) */}
                        {app.timeLimit !== undefined && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Tempo usado hoje:</span>
                              <span className={`text-sm font-bold ${isOverLimit ? 'text-red-600' : 'text-gray-800'}`}>
                                {app.timeUsed} / {app.timeLimit} min
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isOverLimit ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${percentUsed}%` }}
                              ></div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateTimeUsed(app.id, Math.min(app.timeUsed + 10, (app.timeLimit || 0) + 30))}
                                className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                              >
                                + 10 min
                              </button>
                              <button
                                onClick={() => handleUpdateTimeUsed(app.id, 0)}
                                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors"
                              >
                                Resetar
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Status de Bloqueio Automático */}
                        {isOverLimit && (
                          <div className="mb-3 bg-red-100 border border-red-300 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-xs font-bold text-red-800">
                                LIMITE ULTRAPASSADO - BLOQUEADO AUTOMATICAMENTE
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Botão Bloquear/Desbloquear */}
                        <button
                          onClick={() => handleToggleBlock(app.id)}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                            app.isBlocked
                              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                              : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                          }`}
                        >
                          {app.isBlocked ? (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>Bloqueado {isOverLimit ? '(Automático)' : ''}</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-4 h-4" />
                              <span>Permitido</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg hover:scale-105"
            >
              Salvar Alterações
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
