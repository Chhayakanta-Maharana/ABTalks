/**
 * Dynamic API Base URL resolver for ABTalks Engine.
 * Automatically toggles between local Golang server (http://localhost:8080/api/v1)
 * and Production Render backend (https://abtalks-7xr7.onrender.com/api/v1).
 */
export const getApiBaseUrl = (): string => {
  // If explicitly specified in env
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isLocalhost) {
      return "https://abtalks-7xr7.onrender.com/api/v1";
    }
  }

  return "http://localhost:8080/api/v1";
};
