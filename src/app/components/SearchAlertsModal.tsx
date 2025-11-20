"use client";

import { useState } from "react";
import { X, Search, AlertTriangle, Eye, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { SearchAlert } from "../types";

interface SearchAlertsModalProps {
  childName: string;
  searchAlerts: SearchAlert[];
  onClose: () => void;
  onUpdateAlerts: (alerts: SearchAlert[]) => void;
}

type AlertTab = 'all' | 'new' | 'reviewed';

export function SearchAlertsModal({
  childName,
  searchAlerts,
  onClose,
  onUpdateAlerts,
}: SearchAlertsModalProps) {
  const [localAlerts, setLocalAlerts] = useState<SearchAlert[]>(searchAlerts);
  const [activeTab, setActiveTab] = useState<AlertTab>('all');

  const handleMarkAsReviewed = (alertId: string) => {
    const updated = localAlerts.map((alert) =>
      alert.id === alertId ? { ...alert, isReviewed: true } : alert
    );
    setLocalAlerts(updated);
  };

  const handleDeleteAlert = (alertId: string) => {
    const updated = localAlerts.filter((alert) => alert.id !== alertId);
    setLocalAlerts(updated);
  };

  const handleSave = () => {
    onUpdateAlerts(localAlerts);
    onClose();
  };

  const unreviewedCount = localAlerts.filter((a) => !a.isReviewed).length;
  const reviewedCount = localAlerts.filter((a) => a.isReviewed).length;

  const filteredAlerts = activeTab === 'all' 
    ? localAlerts 
    : activeTab === 'new'
    ? localAlerts.filter(a => !a.isReviewed)
    : localAlerts.filter(a => a.isReviewed);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Alertas de Pesquisa - {childName}
              </h2>
              <p className="text-white/90 text-sm">
                Monitoramento em tempo real de buscas suspeitas
              </p>
              {unreviewedCount > 0 && (
                <div className="mt-2 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {unreviewedCount} novo{unreviewedCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <div className="flex min-w-max">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? "bg-white text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                <span>Todos ({localAlerts.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'new'
                  ? "bg-white text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>Novos ({unreviewedCount})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reviewed')}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'reviewed'
                  ? "bg-white text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Revisados ({reviewedCount})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-2">
                {activeTab === 'all' 
                  ? 'Nenhum alerta registrado' 
                  : activeTab === 'new'
                  ? 'Nenhum alerta novo'
                  : 'Nenhum alerta revisado'
                }
              </p>
              <p className="text-sm text-gray-400">
                {activeTab === 'all' && 'Os alertas aparecerão aqui quando palavras-chave suspeitas forem detectadas'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts
                .sort((a, b) => {
                  // Não revisados primeiro
                  if (!a.isReviewed && b.isReviewed) return -1;
                  if (a.isReviewed && !b.isReviewed) return 1;
                  // Depois por data (mais recente primeiro)
                  return (
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                  );
                })
                .map((alert) => (
                  <div
                    key={alert.id}
                    className={`border-2 rounded-2xl p-5 transition-all ${
                      alert.isReviewed
                        ? "border-gray-200 bg-gray-50"
                        : "border-red-200 bg-red-50 shadow-lg"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {!alert.isReviewed && (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              alert.isReviewed
                                ? "bg-gray-200 text-gray-600"
                                : "bg-red-200 text-red-700"
                            }`}
                          >
                            {alert.isReviewed ? "Revisado" : "Novo"}
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            Palavra-chave detectada:
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            "{alert.keyword}"
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Search className="w-4 h-4" />
                            <span>{alert.searchEngine}</span>
                          </div>
                          <div>
                            {new Date(alert.timestamp).toLocaleString("pt-BR")}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!alert.isReviewed && (
                          <button
                            onClick={() => handleMarkAsReviewed(alert.id)}
                            className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-all"
                            title="Marcar como revisado"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                          title="Excluir alerta"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-200"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
