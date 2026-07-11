import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCitations(count: number): string {
  if (count >= 1000) return `${Math.round(count / 1000)}k`;
  return String(count);
}
