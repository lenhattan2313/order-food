import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function normalizeUrl(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}
export function isClient() {
  return typeof window !== undefined;
}
