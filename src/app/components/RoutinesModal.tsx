"use client";

import { useState } from "react";
import { X, Plus, Clock, Calendar, Trash2, Power, Sun, Moon, Utensils } from "lucide-react";
import { Routine } from "../types";

interface RoutinesModalProps {
  childName: string;
  routines: Routine[];
  onClose: () => void;
  onUpdateRoutines: (routines: Routine[]) => void;
}

type RoutineCategory = 'morning' | 'afternoon' | 'evening' | 'all';

export function RoutinesModal({
  childName,
  routines,
  onClose,
  onUpdateRoutines,
}: RoutinesModalProps) {
  const [localRoutines, setLocalRoutines] = useState<Routine[]>(routines);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<RoutineCategory>('all');
  const [newRoutine, setNewRoutine] = useState({
    name: "",
    time: "07:00",
    days: [] as string[],
    description: "",
  });

  const daysOfWeek = [
    { label: "Seg", value: "seg" },
    { label: "Ter", value: "ter" },
    { label: "Qua", value: "qua" },
    { label: "Qui", value: "qui" },
    { label: "Sex", value: "sex" },
    { label: "Sáb", value: "sab" },
    { label: "Dom", value: "dom" },
  ];

  const getRoutineCategory = (time: string): RoutineCategory => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'evening';
  };

  const handleAddRoutine = () => {
    if (!newRoutine.name || newRoutine.days.length === 0) {
      alert("Preencha o nome e selecione pelo menos um dia!");
      return;
    }

    const routine: Routine = {
      id: Date.now().toString(),
      name: newRoutine.name,
      time: newRoutine.time,
      days: newRoutine.days,
      description: newRoutine.description,
      isActive: true,
    };

    const updated = [...localRoutines, routine];
    setLocalRoutines(updated);
    setNewRoutine({ name: "", time: "07:00", days: [], description: "" });
    setIsAdding(false);
  };

  const handleToggleDay = (day: string) => {
    setNewRoutine((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleToggleActive = (routineId: string) => {
    const updated = localRoutines.map((r) =>
      r.id === routineId ? { ...r, isActive: !r.isActive } : r
    );
    setLocalRoutines(updated);
  };

  const handleDeleteRoutine = (routineId: string) => {
    const updated = localRoutines.filter((r) => r.id !== routineId);
    setLocalRoutines(updated);
  };

  const handleSave = () => {
    onUpdateRoutines(localRoutines);
    onClose();
  };

  const filteredRoutines = activeTab === 'all' 
    ? localRoutines 
    : localRoutines.filter(routine => getRoutineCategory(routine.time) === activeTab);

  const morningCount = localRoutines.filter(r => getRoutineCategory(r.time) === 'morning').length;
  const afternoonCount = localRoutines.filter(r => getRoutineCategory(r.time) === 'afternoon').length;
  const eveningCount = localRoutines.filter(r => getRoutineCategory(r.time) === 'evening').length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Rotinas de {childName}</h2>
              <p className="text-white/90 text-sm">
                Configure horários e atividades diárias
              </p>
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
                  ? "bg-white text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Todas ({localRoutines.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('morning')}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'morning'
                  ? "bg-white text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sun className="w-5 h-5" />
                <span>Manhã ({morningCount})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('afternoon')}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'afternoon'
                  ? "bg-white text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Utensils className="w-5 h-5" />
                <span>Tarde ({afternoonCount})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('evening')}
              className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === 'evening'
                  ? "bg-white text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Moon className="w-5 h-5" />
                <span>Noite ({eveningCount})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Botão Adicionar */}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Nova Rotina
            </button>
          )}

          {/* Formulário de Adicionar */}
          {isAdding && (
            <div className="mb-6 bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-2xl border-2 border-orange-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Nova Rotina
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome da Rotina
                  </label>
                  <input
                    type="text"
                    value={newRoutine.name}
                    onChange={(e) =>
                      setNewRoutine({ ...newRoutine, name: e.target.value })
                    }
                    placeholder="Ex: Acordar, Ir para escola, Jantar..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={newRoutine.time}
                    onChange={(e) =>
                      setNewRoutine({ ...newRoutine, time: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dias da Semana
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        onClick={() => handleToggleDay(day.value)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                          newRoutine.days.includes(day.value)
                            ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={newRoutine.description}
                    onChange={(e) =>
                      setNewRoutine({
                        ...newRoutine,
                        description: e.target.value,
                      })
                    }
                    placeholder="Detalhes sobre a rotina..."
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddRoutine}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewRoutine({
                        name: "",
                        time: "07:00",
                        days: [],
                        description: "",
                      });
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Rotinas */}
          {filteredRoutines.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {activeTab === 'all' 
                  ? 'Nenhuma rotina cadastrada' 
                  : `Nenhuma rotina para ${
                      activeTab === 'morning' ? 'manhã' : 
                      activeTab === 'afternoon' ? 'tarde' : 'noite'
                    }`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoutines
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((routine) => (
                  <div
                    key={routine.id}
                    className={`bg-white border-2 rounded-2xl p-5 transition-all ${
                      routine.isActive
                        ? "border-orange-200 shadow-lg"
                        : "border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          <h4 className="text-lg font-bold text-gray-800">
                            {routine.name}
                          </h4>
                        </div>
                        <p className="text-2xl font-bold text-orange-600 mb-2">
                          {routine.time}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {routine.days.map((day) => (
                            <span
                              key={day}
                              className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                        {routine.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {routine.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(routine.id)}
                          className={`p-2 rounded-xl transition-all ${
                            routine.isActive
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <Power className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoutine(routine.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
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
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-200"
          >
            Salvar Rotinas
          </button>
        </div>
      </div>
    </div>
  );
}
