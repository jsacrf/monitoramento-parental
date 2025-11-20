"use client";

import { Clock, Plus, RotateCcw, Trash2, AlertCircle, CheckCircle, Smartphone, Calendar, Search, MapPin, Phone } from "lucide-react";
import { Child } from "../types";
import { useState } from "react";
import { AppManagementModal } from "./AppManagementModal";
import { RoutinesModal } from "./RoutinesModal";
import { SearchAlertsModal } from "./SearchAlertsModal";
import { LocationMapModal } from "./LocationMapModal";
import { CommunicationModal } from "./CommunicationModal";

interface ChildCardProps {
  child: Child;
  onUpdateScreenTime: (childId: string, minutes: number) => void;
  onResetScreenTime: (childId: string) => void;
  onDelete: (childId: string) => void;
  onUpdateApps: (childId: string, apps: Child['apps']) => void;
  onUpdateRoutines: (childId: string, routines: Child['routines']) => void;
  onUpdateSearchAlerts: (childId: string, alerts: Child['searchAlerts']) => void;
  onUpdateCommunication: (childId: string, callLogs: Child['callLogs'], messages: Child['messages']) => void;
}

export function ChildCard({
  child,
  onUpdateScreenTime,
  onResetScreenTime,
  onDelete,
  onUpdateApps,
  onUpdateRoutines,
  onUpdateSearchAlerts,
  onUpdateCommunication,
}: ChildCardProps) {
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isRoutinesModalOpen, setIsRoutinesModalOpen] = useState(false);
  const [isSearchAlertsModalOpen, setIsSearchAlertsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);
  
  const isOverLimit = child.screenTime > child.timeLimit;
  const percentage = Math.min((child.screenTime / child.timeLimit) * 100, 100);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const blockedAppsCount = child.apps?.filter(app => app.isBlocked).length || 0;
  const totalApps = child.apps?.length || 0;
  const activeRoutines = child.routines?.filter(r => r.isActive).length || 0;
  const unreviewedAlerts = child.searchAlerts?.filter(a => !a.isReviewed).length || 0;
  const totalCommunications = (child.callLogs?.length || 0) + (child.messages?.length || 0);

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105">
        {/* Header do Card */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {child.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{child.age} anos</p>
            </div>
          </div>
          <button
            onClick={() => onDelete(child.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Gráfico Circular de Progresso */}
        <div className="mb-5">
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Círculo de fundo */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              {/* Círculo de progresso */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={isOverLimit ? "url(#gradient-red)" : "url(#gradient-blue)"}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Gradientes */}
              <defs>
                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
              </defs>
            </svg>
            {/* Texto central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">
                {formatTime(child.screenTime)}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                de {formatTime(child.timeLimit)}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-5">
          {isOverLimit ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Limite ultrapassado</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-2xl border border-green-100">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Dentro do limite</span>
            </div>
          )}
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Apps */}
          {totalApps > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {totalApps} app{totalApps !== 1 ? 's' : ''}
                  </p>
                  {blockedAppsCount > 0 && (
                    <p className="text-xs text-red-600 font-bold">
                      {blockedAppsCount} bloq.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rotinas */}
          {activeRoutines > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 px-3 py-2 rounded-xl border border-orange-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {activeRoutines} rotina{activeRoutines !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-green-600 font-bold">Ativas</p>
                </div>
              </div>
            </div>
          )}

          {/* Alertas */}
          {unreviewedAlerts > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-3 py-2 rounded-xl border border-red-200">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-red-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {unreviewedAlerts} alerta{unreviewedAlerts !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-red-600 font-bold">Novos</p>
                </div>
              </div>
            </div>
          )}

          {/* Comunicações */}
          {totalCommunications > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {totalCommunications} reg.
                  </p>
                  <p className="text-xs text-purple-600 font-bold">Comun.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Funcionalidades */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setIsAppModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            <Smartphone className="w-4 h-4" />
            <span>Apps</span>
          </button>

          <button
            onClick={() => setIsRoutinesModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            <Calendar className="w-4 h-4" />
            <span>Rotinas</span>
          </button>

          <button
            onClick={() => setIsSearchAlertsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            <Search className="w-4 h-4" />
            <span>Alertas</span>
            {unreviewedAlerts > 0 && (
              <span className="bg-white text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreviewedAlerts}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            <MapPin className="w-4 h-4" />
            <span>Mapa</span>
          </button>

          <button
            onClick={() => setIsCommunicationModalOpen(true)}
            className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            <Phone className="w-4 h-4" />
            <span>Chamadas & Mensagens</span>
          </button>
        </div>

        {/* Botões de Ação - Tempo de Tela */}
        <div className="space-y-3 mb-4">
          {/* Botões de adicionar tempo */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpdateScreenTime(child.id, 15)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>15min</span>
            </button>
            <button
              onClick={() => onUpdateScreenTime(child.id, 30)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>30min</span>
            </button>
          </div>

          {/* Botão de reset */}
          <button
            onClick={() => onResetScreenTime(child.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-200 font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Resetar Tempo</span>
          </button>
        </div>

        {/* Última Atualização */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Clock className="w-4 h-4" />
            <span>
              Atualizado às {new Date(child.lastUpdated).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Modais */}
      {isAppModalOpen && (
        <AppManagementModal
          childName={child.name}
          apps={child.apps || []}
          onClose={() => setIsAppModalOpen(false)}
          onUpdateApps={(apps) => onUpdateApps(child.id, apps)}
        />
      )}

      {isRoutinesModalOpen && (
        <RoutinesModal
          childName={child.name}
          routines={child.routines || []}
          onClose={() => setIsRoutinesModalOpen(false)}
          onUpdateRoutines={(routines) => onUpdateRoutines(child.id, routines)}
        />
      )}

      {isSearchAlertsModalOpen && (
        <SearchAlertsModal
          childName={child.name}
          searchAlerts={child.searchAlerts || []}
          onClose={() => setIsSearchAlertsModalOpen(false)}
          onUpdateAlerts={(alerts) => onUpdateSearchAlerts(child.id, alerts)}
        />
      )}

      {isLocationModalOpen && (
        <LocationMapModal
          childName={child.name}
          location={child.location}
          onClose={() => setIsLocationModalOpen(false)}
        />
      )}

      {isCommunicationModalOpen && (
        <CommunicationModal
          childName={child.name}
          callLogs={child.callLogs || []}
          messages={child.messages || []}
          onClose={() => setIsCommunicationModalOpen(false)}
          onUpdateCommunication={(callLogs, messages) => 
            onUpdateCommunication(child.id, callLogs, messages)
          }
        />
      )}
    </>
  );
}
