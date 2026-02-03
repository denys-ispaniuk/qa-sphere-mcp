import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface QASphereConfig {
  apiKey: string;
  baseUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  requestTimeout: number;
}

/**
 * Validates and returns configuration from environment variables
 */
export function getConfig(): QASphereConfig {
  const apiKey = process.env.QASPHERE_API_KEY;
  const baseUrl = process.env.QASPHERE_BASE_URL;

  if (!apiKey) {
    throw new Error(
      'QASPHERE_API_KEY environment variable is required. ' +
      'Please set it in your .env file or environment.'
    );
  }

  if (!baseUrl) {
    throw new Error(
      'QASPHERE_BASE_URL environment variable is required. ' +
      'Please set it in your .env file or environment. ' +
      'Example: https://your-company.your-region.qasphere.com/api/public/v0'
    );
  }

  const logLevel = (process.env.LOG_LEVEL || 'info') as QASphereConfig['logLevel'];
  const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '30000', 10);

  return {
    apiKey,
    baseUrl,
    logLevel,
    requestTimeout,
  };
}

/**
 * Validates the configuration
 */
export function validateConfig(config: QASphereConfig): void {
  // Validate base URL format
  try {
    new URL(config.baseUrl);
  } catch (error) {
    throw new Error(`Invalid QASPHERE_BASE_URL: ${config.baseUrl}`);
  }

  // Validate API key format (basic check)
  if (config.apiKey.length < 10) {
    throw new Error('QASPHERE_API_KEY appears to be invalid (too short)');
  }

  // Validate log level
  const validLogLevels = ['debug', 'info', 'warn', 'error'];
  if (!validLogLevels.includes(config.logLevel)) {
    throw new Error(`Invalid LOG_LEVEL: ${config.logLevel}. Must be one of: ${validLogLevels.join(', ')}`);
  }

  // Validate timeout
  if (config.requestTimeout < 1000 || config.requestTimeout > 120000) {
    throw new Error('REQUEST_TIMEOUT must be between 1000 and 120000 milliseconds');
  }
}
