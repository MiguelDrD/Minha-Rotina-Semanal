import { useEffect, useState } from "react";

export type Cell = string; // task text with optional emoji prefix, e.g. "💪 Treino"

export type Row = {
  id: string;
  time: string; // "07:30"
  cells: Cell[]; // length 7 (Mon..Sun)
};

export type Period = {
  id: string;
  label: string; // "🌅 Manhã"
  rows: Row[];
};

export type Routine = {
  title: string;
  subtitle: string;
  days: string[]; // 7 day names
  periods: Period[];
};

const STORAGE_KEY = "rotina_semanal_v1";

export const DAYS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

const id = () => Math.random().toString(36).slice(2, 10);

export const defaultRoutine: Routine = {
  title: "Minha Rotina Semanal",
  subtitle: "Disciplina, foco e energia todos os dias ⚡",
  days: DAYS,
  periods: [
    {
      id: id(),
      label: "🌅 Manhã",
      rows: [
        { id: id(), time: "06:00", cells: ["⏰ Acordar", "⏰ Acordar", "⏰ Acordar", "⏰ Acordar", "⏰ Acordar", "💤 Livre", "💤 Livre"] },
        { id: id(), time: "06:30", cells: ["🏋️ Treino", "🏃 Corrida", "🏋️ Treino", "🏃 Corrida", "🏋️ Treino", "⚽ Futebol", "—"] },
        { id: id(), time: "08:00", cells: ["🥚 Café da manhã", "🥚 Café da manhã", "🥚 Café da manhã", "🥚 Café da manhã", "🥚 Café da manhã", "🥓 Brunch", "🥓 Brunch"] },
        { id: id(), time: "09:00", cells: ["💼 Trabalho", "💼 Trabalho", "💼 Trabalho", "💼 Trabalho", "💼 Trabalho", "🛠️ Projetos", "📖 Leitura"] },
        { id: id(), time: "12:00", cells: ["🍖 Almoço", "🍖 Almoço", "🍖 Almoço", "🍖 Almoço", "🍖 Almoço", "🍔 Almoço", "🍝 Almoço"] },
      ],
    },
    {
      id: id(),
      label: "☀️ Tarde",
      rows: [
        { id: id(), time: "13:30", cells: ["💼 Trabalho", "💼 Trabalho", "💼 Trabalho", "💼 Trabalho", "💼 Trabalho", "🎮 Lazer", "🎮 Lazer"] },
        { id: id(), time: "17:00", cells: ["📚 Estudo", "📚 Estudo", "🎯 Hobby", "📚 Estudo", "🎯 Hobby", "🛒 Mercado", "👨‍👩‍👦 Família"] },
        { id: id(), time: "18:30", cells: ["🥗 Jantar leve", "🥗 Jantar leve", "🥗 Jantar leve", "🥗 Jantar leve", "🍻 Happy hour", "🍕 Jantar", "🍲 Jantar"] },
      ],
    },
    {
      id: id(),
      label: "🌆 Noite",
      rows: [
        { id: id(), time: "20:00", cells: ["🧘 Meditação", "🥋 Jiu-jitsu", "🧘 Meditação", "🥋 Jiu-jitsu", "🎬 Cinema", "🍻 Amigos", "📖 Leitura"] },
        { id: id(), time: "22:00", cells: ["📖 Leitura", "📖 Leitura", "📖 Leitura", "📖 Leitura", "—", "—", "📖 Leitura"] },
        { id: id(), time: "23:00", cells: ["🌙 Dormir", "🌙 Dormir", "🌙 Dormir", "🌙 Dormir", "🌙 Dormir", "🌙 Dormir", "🌙 Dormir"] },
      ],
    },
  ],
};

export function loadRoutine(): Routine {
  if (typeof window === "undefined") return defaultRoutine;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultRoutine;
    return JSON.parse(raw) as Routine;
  } catch {
    return defaultRoutine;
  }
}

export function saveRoutine(r: Routine) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function resetRoutine() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

export function useRoutine(): [Routine, (r: Routine) => void] {
  const [routine, setRoutine] = useState<Routine>(defaultRoutine);
  useEffect(() => {
    setRoutine(loadRoutine());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setRoutine(loadRoutine());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const update = (r: Routine) => {
    setRoutine(r);
    saveRoutine(r);
  };
  return [routine, update];
}

export const newId = id;