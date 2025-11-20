"use client";

import { useState } from "react";
import { X, Phone, MessageSquare, Trash2, Filter } from "lucide-react";
import { CallLog, Message } from "../types";

interface CommunicationModalProps {
  childName: string;
  callLogs: CallLog[];
  messages: Message[];
  onClose: () => void;
  onUpdateCommunication: (callLogs: CallLog[], messages: Message[]) => void;
}

export function CommunicationModal({
  childName,
  callLogs,
  messages,
  onClose,
  onUpdateCommunication,
}: CommunicationModalProps) {
  const [localCallLogs, setLocalCallLogs] = useState<CallLog[]>(callLogs);
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [activeTab, setActiveTab] = useState<"calls" | "messages">("calls");
  const [filterType, setFilterType] = useState<string>("all");

  const handleDeleteCall = (callId: string) => {
    const updated = localCallLogs.filter((call) => call.id !== callId);
    setLocalCallLogs(updated);
  };

  const handleDeleteMessage = (messageId: string) => {
    const updated = localMessages.filter((msg) => msg.id !== messageId);
    setLocalMessages(updated);
  };

  const handleSave = () => {
    onUpdateCommunication(localCallLogs, localMessages);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getCallTypeColor = (type: CallLog["type"]) => {
    switch (type) {
      case "incoming":
        return "bg-green-100 text-green-700";
      case "outgoing":
        return "bg-blue-100 text-blue-700";
      case "missed":
        return "bg-red-100 text-red-700";
    }
  };

  const getCallTypeLabel = (type: CallLog["type"]) => {
    switch (type) {
      case "incoming":
        return "Recebida";
      case "outgoing":
        return "Efetuada";
      case "missed":
        return "Perdida";
    }
  };

  const getMessageTypeColor = (type: Message["type"]) => {
    switch (type) {
      case "sms":
        return "bg-gray-100 text-gray-700";
      case "whatsapp":
        return "bg-green-100 text-green-700";
      case "messenger":
        return "bg-blue-100 text-blue-700";
    }
  };

  const filteredCalls =
    filterType === "all"
      ? localCallLogs
      : localCallLogs.filter((call) => call.type === filterType);

  const filteredMessages =
    filterType === "all"
      ? localMessages
      : localMessages.filter((msg) => msg.type === filterType);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Comunicações de {childName}
              </h2>
              <p className="text-white/90 text-sm">
                Rastreamento de chamadas e mensagens
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
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("calls");
                setFilterType("all");
              }}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "calls"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                <span>Chamadas ({localCallLogs.length})</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab("messages");
                setFilterType("all");
              }}
              className={`flex-1 px-6 py-4 font-semibold transition-all ${
                activeTab === "messages"
                  ? "bg-white text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>Mensagens ({localMessages.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
            >
              <option value="all">Todos</option>
              {activeTab === "calls" ? (
                <>
                  <option value="incoming">Recebidas</option>
                  <option value="outgoing">Efetuadas</option>
                  <option value="missed">Perdidas</option>
                </>
              ) : (
                <>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="messenger">Messenger</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "calls" ? (
            filteredCalls.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  Nenhuma chamada registrada
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCalls
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .map((call) => (
                    <div
                      key={call.id}
                      className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${getCallTypeColor(
                                call.type
                              )}`}
                            >
                              {getCallTypeLabel(call.type)}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-800 mb-1">
                            {call.contact}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-semibold">
                              {formatDuration(call.duration)}
                            </span>
                            <span>
                              {new Date(call.timestamp).toLocaleString("pt-BR")}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteCall(call.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                Nenhuma mensagem registrada
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${getMessageTypeColor(
                            message.type
                          )}`}
                        >
                          {message.type.toUpperCase()}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            message.isIncoming
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {message.isIncoming ? "Recebida" : "Enviada"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      {message.contact}
                    </p>
                    <p className="text-gray-700 mb-2 bg-gray-50 p-3 rounded-xl">
                      {message.content}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-200"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
