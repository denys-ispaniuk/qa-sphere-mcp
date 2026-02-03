import { AxiosError } from 'axios';
import { logger } from './logger.js';

export interface MCPError {
  code: string;
  message: string;
  details?: unknown;
}

export class QASphereError extends Error {
  public code: string;
  public statusCode?: number;
  public details?: unknown;

  constructor(message: string, code: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'QASphereError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Handles errors from API calls and converts them to structured format
 */
export function handleApiError(error: unknown): MCPError {
  logger.error('API Error occurred', error);

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const responseData = error.response?.data;

    if (statusCode === 401 || statusCode === 403) {
      return {
        code: 'AUTH_ERROR',
        message: 'Authentication failed. Please check your API key.',
        details: { statusCode, response: responseData },
      };
    }

    if (statusCode === 404) {
      return {
        code: 'NOT_FOUND',
        message: 'Resource not found.',
        details: { statusCode, response: responseData },
      };
    }

    if (statusCode === 400) {
      return {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters.',
        details: { statusCode, response: responseData },
      };
    }

    if (statusCode && statusCode >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'QA Sphere server error. Please try again later.',
        details: { statusCode, response: responseData },
      };
    }

    return {
      code: 'API_ERROR',
      message: error.message || 'An API error occurred.',
      details: { statusCode, response: responseData },
    };
  }

  // Handle custom QASphereError
  if (error instanceof QASphereError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      details: { stack: error.stack },
    };
  }

  // Handle unknown errors
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred.',
    details: error,
  };
}

/**
 * Formats error for MCP response
 */
export function formatErrorResponse(error: MCPError): string {
  const response: { success: false; error: { code: string; message: string; details?: unknown } } = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
  };
  
  if (error.details) {
    response.error.details = error.details;
  }
  
  return JSON.stringify(response, null, 2);
}

/**
 * Validates required parameters
 */
export function validateRequiredParams(
  params: Record<string, unknown>,
  required: string[]
): void {
  const missing = required.filter(key => !params[key]);
  
  if (missing.length > 0) {
    throw new QASphereError(
      `Missing required parameters: ${missing.join(', ')}`,
      'VALIDATION_ERROR',
      400,
      { missing }
    );
  }
}
