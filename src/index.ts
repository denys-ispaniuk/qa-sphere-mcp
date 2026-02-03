#!/usr/bin/env node

import { getConfig, validateConfig } from './config.js';
import { logger } from './utils/logger.js';
import { QASphereMCPServer } from './server.js';

/**
 * Main entry point for QA Sphere MCP Server
 */
async function main() {
  try {
    // Load and validate configuration
    const config = getConfig();
    validateConfig(config);
    
    // Set log level
    logger.setLevel(config.logLevel);
    
    logger.info('Configuration loaded successfully');
    logger.debug('Config', {
      baseUrl: config.baseUrl,
      logLevel: config.logLevel,
      requestTimeout: config.requestTimeout,
    });

    // Create and start server
    const server = new QASphereMCPServer(config);
    await server.start();
    
  } catch (error) {
    logger.error('Failed to start QA Sphere MCP Server', error);
    
    if (error instanceof Error) {
      process.stderr.write(`\n❌ Error: ${error.message}\n`);

      if (error.message.includes('QASPHERE_API_KEY')) {
        process.stderr.write('Please set the QASPHERE_API_KEY environment variable.\n');
        process.stderr.write('Example: export QASPHERE_API_KEY=your-api-key\n\n');
      }

      if (error.message.includes('QASPHERE_BASE_URL')) {
        process.stderr.write('Please set the QASPHERE_BASE_URL environment variable.\n');
        process.stderr.write('Example: export QASPHERE_BASE_URL=https://your-company.your-region.qasphere.com/api/public/v0\n\n');
      }
    }
    
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', reason);
  process.exit(1);
});

// Start the server
main();
