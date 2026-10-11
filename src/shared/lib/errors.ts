export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation failed") {
    super(message, 422);
    this.name = "ValidationError";
  }
}

export class NetworkError extends ApiError {
  constructor(message = "Network error. Please check your connection.") {
    super(message, 0);
    this.name = "NetworkError";
  }
}

export class UnexpectedError extends ApiError {
  constructor(message = "An unexpected error occurred") {
    super(message, 500);
    this.name = "UnexpectedError";
  }
}

export class RequestTimeoutError extends ApiError {
  constructor(message = "The request timed out. Please try again.") {
    super(message, 408);
    this.name = "RequestTimeoutError";
  }
}

export function mapAxiosError(error: unknown): ApiError {
  if (!error || typeof error !== "object") {
    return new UnexpectedError();
  }

  const axiosError = error as {
    response?: { status?: number; data?: { message?: string; code?: number } };
    code?: string;
    message?: string;
  };

  if (axiosError.code === "ERR_NETWORK") {
    return new NetworkError();
  }

  if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
    return new RequestTimeoutError();
  }

  const status = axiosError.response?.status ?? 500;
  const message = axiosError.response?.data?.message ?? axiosError.message ?? "Request failed";
  const code = axiosError.response?.data?.code;

  if (status === 401) return new UnauthorizedError(message);
  if (status === 403) return new ForbiddenError(message);
  if (status === 422) return new ValidationError(message);

  return new ApiError(message, status, code);
}
