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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoutineFn, saveRoutineFn } from "./db-actions";

export function loadRoutine(): Routine {
  // Fallback para o default antes do banco carregar
  return defaultRoutine;
}

export function useRoutine(): [Routine, (r: Routine) => void, boolean] {
  const queryClient = useQueryClient();

  const { data: routine = defaultRoutine, isLoading } = useQuery({
    queryKey: ["routine"],
    queryFn: () => getRoutineFn(),
  });

  const mutation = useMutation({
    mutationFn: async (newRoutine: Routine) => {
      // Otimista: atualiza a tela instantaneamente
      queryClient.setQueryData(["routine"], newRoutine);
      await saveRoutineFn({ data: newRoutine });
    },
    onError: (err, newRoutine, context) => {
      // Reverter se der erro (opcional, pode só mostrar um toast)
      console.error("Falha ao salvar rotina", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["routine"] });
    },
  });

  const update = (r: Routine) => {
    mutation.mutate(r);
  };

  return [routine, update, isLoading];
}

export const newId = id;