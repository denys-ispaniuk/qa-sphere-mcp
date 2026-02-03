import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { QASphereConfig } from '../config.js';
import { logger } from '../utils/logger.js';
import { QASphereError } from '../utils/error-handler.js';

export class QASphereClient {
  private client: AxiosInstance;
  private config: QASphereConfig;

  constructor(config: QASphereConfig) {
    this.config = config;
    
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.requestTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${config.apiKey}`,
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`, {
          data: response.data,
        });
        return response;
      },
      (error) => {
        logger.error('API Error', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      if (status === 401 || status === 403) {
        return new QASphereError(
          'Authentication failed. Please check your API key.',
          'AUTH_ERROR',
          status,
          error.response?.data
        );
      }
      
      if (status === 404) {
        return new QASphereError(
          'Resource not found.',
          'NOT_FOUND',
          status,
          error.response?.data
        );
      }
      
      if (status === 400) {
        return new QASphereError(
          message || 'Invalid request parameters.',
          'VALIDATION_ERROR',
          status,
          error.response?.data
        );
      }
      
      if (status && status >= 500) {
        return new QASphereError(
          'QA Sphere server error. Please try again later.',
          'SERVER_ERROR',
          status,
          error.response?.data
        );
      }
      
      return new QASphereError(
        message,
        'API_ERROR',
        status,
        error.response?.data
      );
    }
    
    if (error instanceof Error) {
      return error;
    }
    
    return new Error('Unknown error occurred');
  }
}
