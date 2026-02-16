import { AxiosError } from "axios";

// USed to extract error messages from axios
export function getErrorMessage(error: unknown, fallback: string = "An unexpected error occurred"): string {
  // Check if it's an Axios error with response data
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || fallback;
  }
  
  // Check if it's a standard Error object
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallback;
}
