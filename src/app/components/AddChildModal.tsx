"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface AddChildModalProps {
  onClose: () => void;
  onAdd: (name: string, age: number, timeLimit: number) => void;
}

export function AddChildModal({ onClose, onAdd }: AddChildModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [timeLimit, setTimeLimit] = useState("120");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Por favor, insira o nome");
      return;
    }

    const ageNum = parseInt(age);
    if (!age || ageNum < 1 || ageNum > 18) {
      setError("Idade deve estar entre 1 e 18 anos");
      return;
    }

    const limitNum = parseInt(timeLimit);
    if (!timeLimit || limitNum < 1) {
      setError("Limite de tempo deve ser maior que 0");
      return;
    }

    onAdd(name.trim(), ageNum, limitNum);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Adicionar Filho</h2>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nome do Filho
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Ex: João Silva"
            />
          </div>

          {/* Idade */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Idade
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Ex: 10"
              min="1"
              max="18"
            />
          </div>

          {/* Limite de Tempo */}
          <div>
            <label
              htmlFor="timeLimit"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Limite Diário (minutos)
            </label>
            <input
              id="timeLimit"
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="Ex: 120"
              min="1"
            />
            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-700 font-medium">
                💡 Recomendação: 120 minutos (2 horas) por dia
              </p>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 py-3 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:scale-105"
            >
              <UserPlus className="w-5 h-5" />
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
