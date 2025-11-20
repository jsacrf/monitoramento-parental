export interface App {
  id: string;
  name: string;
  category: 'game' | 'social' | 'education' | 'entertainment' | 'other';
  icon: string;
  isBlocked: boolean;
  timeLimit?: number; // limite em minutos por dia (opcional)
  timeUsed: number; // tempo usado hoje em minutos
}

export interface Routine {
  id: string;
  name: string;
  time: string; // formato HH:MM
  days: string[]; // ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
  description: string;
  isActive: boolean;
}

export interface SearchAlert {
  id: string;
  keyword: string;
  timestamp: string;
  searchEngine: string;
  isReviewed: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
  address?: string;
}

export interface CallLog {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  contact: string;
  duration: number; // em segundos
  timestamp: string;
}

export interface Message {
  id: string;
  type: 'sms' | 'whatsapp' | 'messenger';
  contact: string;
  content: string;
  timestamp: string;
  isIncoming: boolean;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  timeLimit: number; // em minutos
  screenTime: number; // em minutos
  lastUpdated: string;
  apps: App[]; // lista de apps/jogos
  routines: Routine[]; // rotinas diárias
  searchAlerts: SearchAlert[]; // alertas de pesquisa
  location?: Location; // localização atual
  callLogs: CallLog[]; // histórico de chamadas
  messages: Message[]; // histórico de mensagens
}

export interface User {
  email: string;
  loginDate: string;
}
