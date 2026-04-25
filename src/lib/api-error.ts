type ErrorWithMessage = {
  message?: string;
  name?: string;
};

function getRawErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const knownError = error as ErrorWithMessage;
    return knownError.message ?? knownError.name ?? "Unknown server error.";
  }

  return typeof error === "string" ? error : "Unknown server error.";
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  const rawMessage = getRawErrorMessage(error).toLowerCase();

  if (rawMessage.includes("sqlite") || rawMessage.includes("database is locked")) {
    return "The local database is unavailable right now. Try again in a moment.";
  }

  if (rawMessage.includes("jwt_secret is not defined")) {
    return "Server configuration is incomplete. Add JWT_SECRET to your environment variables.";
  }

  return fallbackMessage;
}

export function logApiError(label: string, error: unknown) {
  console.error(`[${label}]`, error);
}
