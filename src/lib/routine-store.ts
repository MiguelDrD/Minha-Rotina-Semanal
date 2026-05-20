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
  theme?: {
    headerFrom: string;
    headerTo: string;
    periodBg: string;
    rowAlt: string;
    timeCol?: string;
    dayHeader?: string;
  };
};

const STORAGE_KEY = "rotina_semanal_v1";

function getStoredRoutine(): Routine | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Routine) : null;
  } catch (error) {
    console.error("Erro lendo rotina do localStorage:", error);
    return null;
  }
}

function saveRoutineToStorage(routine: Routine) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routine));
  } catch (error) {
    console.error("Erro gravando rotina no localStorage:", error);
  }
}

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
  title: "🌸 Minha Rotina Semanal 🌸",
  subtitle: "Organização e bem-estar em cada dia ✨",
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
  theme: {
    headerFrom: "#f39ca8", // soft rose
    headerTo: "#f6d1e5",   // pale pink
    periodBg: "#fde8f2",   // blush light
    rowAlt: "#ffe6f0",     // gentle pink
    timeCol: "#c98eb8",    // muted mauve
    dayHeader: "#f4a8c4",  // warm pink
  },
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoutineFn, saveRoutineFn } from "./db-actions";

export function loadRoutine(): Routine {
  // Use o valor gravado localmente se existir.
  return getStoredRoutine() ?? defaultRoutine;
}

export function useRoutine(): [Routine, (r: Routine) => void, boolean] {
  const queryClient = useQueryClient();
  const localRoutine = getStoredRoutine();

  const query = useQuery<Routine, unknown, Routine>({
    queryKey: ["routine"],
    queryFn: async () => {
      const stored = getStoredRoutine();
      if (stored) {
        return stored;
      }
      return getRoutineFn();
    },
    initialData: localRoutine ?? defaultRoutine,
    enabled: typeof window !== "undefined",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const routine = query.data as Routine;
  const isLoading = query.isLoading;

  const mutation = useMutation({
    mutationFn: async (newRoutine: Routine) => {
      queryClient.setQueryData(["routine"], newRoutine);
      saveRoutineToStorage(newRoutine);
      if (!process.env.UPSTASH_REDIS_REST_URL) {
        return;
      }
      await saveRoutineFn({ data: newRoutine } as any);
    },
    onError: (err, newRoutine, context) => {
      console.error("Falha ao salvar rotina", err);
    },
  });

  const update = (r: Routine) => {
    mutation.mutate(r);
  };

  return [routine, update, isLoading];
}

export const newId = id;