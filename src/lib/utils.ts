import { toast } from "@/hooks/use-toast";
import { HttpError } from "@/lib/error";
import { clsx, type ClassValue } from "clsx";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function normalizeUrl(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}
export function isClient() {
  return typeof window !== "undefined";
}
export function handleApiError<T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>
) {
  if (error instanceof HttpError && setError) {
    error.errors.forEach(({ field, message }: FieldValues) => {
      setError(field, {
        message,
        type: "server",
      });
    });
  } else {
    toast({
      description: (error as Error).message,
    });
  }
}
