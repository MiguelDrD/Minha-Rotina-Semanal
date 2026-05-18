import { createServerFn } from "@tanstack/react-start";
import { Redis } from "@upstash/redis";
import { defaultRoutine, type Routine } from "../lib/routine-store";

// Use environment variables locally or in Vercel
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const getRoutineFn = createServerFn("GET", async () => {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn("UPSTASH_REDIS_REST_URL is missing. Returning default routine.");
    return defaultRoutine;
  }
  try {
    const routine = await redis.get<Routine>("rotina_semanal");
    return routine || defaultRoutine;
  } catch (error) {
    console.error("Error fetching routine from Upstash:", error);
    return defaultRoutine;
  }
});

export const saveRoutineFn = createServerFn("POST", async (routine: Routine) => {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn("UPSTASH_REDIS_REST_URL is missing. Skipping save.");
    return;
  }
  try {
    await redis.set("rotina_semanal", routine);
  } catch (error) {
    console.error("Error saving routine to Upstash:", error);
    throw new Error("Falha ao salvar rotina");
  }
});
