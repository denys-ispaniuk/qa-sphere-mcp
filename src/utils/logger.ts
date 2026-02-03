type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private level: LogLevel;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(level: LogLevel = 'info') {
    this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data !== undefined) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
    }
    
    return `${prefix} ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      process.stderr.write(this.formatMessage('debug', message, data) + '\n');
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      process.stderr.write(this.formatMessage('info', message, data) + '\n');
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      process.stderr.write(this.formatMessage('warn', message, data) + '\n');
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      const errorData = error instanceof Error 
        ? { message: error.message, stack: error.stack }
        : error;
      process.stderr.write(this.formatMessage('error', message, errorData) + '\n');
    }
  }
}

// Export singleton instance
export const logger = new Logger();
