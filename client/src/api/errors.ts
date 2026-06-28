import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/index";

/**
 * Extracts a human-readable error message from a thrown value, preferring
 * the API's `{ error: string }` body when the failure was an Axios request,
 * and falling back to a caller-supplied default otherwise.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError<ApiErrorResponse>(err)) {
    return err.response?.data?.error ?? fallback;
  }
  return fallback;
}