import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { QASphereClient } from './api/client.js';
import { QASphereConfig } from './config.js';
import { logger } from './utils/logger.js';
import { handleApiError, formatErrorResponse } from './utils/error-handler.js';

// Import tool handlers
import { getProjectTools } from './tools/projects.js';
import { getTestCaseTools } from './tools/test-cases.js';
import { getFolderTools } from './tools/folders.js';
import { getTagTools } from './tools/tags.js';
import { getPreconditionTools } from './tools/preconditions.js';
import { getTestPlanTools } from './tools/test-plans.js';
import { getRequirementTools } from './tools/requirements.js';

export interface ToolHandler {
  (client: QASphereClient, args: Record<string, unknown>): Promise<string>;
}

export interface MCPTool extends Tool {
  handler: ToolHandler;
}

export class QASphereMCPServer {
  private server: Server;
  private client: QASphereClient;
  private tools: Map<string, MCPTool> = new Map();

  constructor(config: QASphereConfig) {
    this.client = new QASphereClient(config);
    
    this.server = new Server(
      {
        name: 'qasphere-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.registerTools();
  }

  /**
   * Register all tools
   */
  private registerTools(): void {
    const allTools: MCPTool[] = [
      ...getProjectTools(),
      ...getTestCaseTools(),
      ...getFolderTools(),
      ...getTagTools(),
      ...getPreconditionTools(),
      ...getTestPlanTools(),
      ...getRequirementTools(),
    ];

    allTools.forEach(tool => {
      this.tools.set(tool.name, tool);
      logger.info(`Registered tool: ${tool.name}`);
    });

    logger.info(`Total tools registered: ${this.tools.size}`);
  }

  /**
   * Setup MCP request handlers
   */
  private setupHandlers(): void {
    // Handle list_tools request
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.debug('Handling list_tools request');
      
      const tools = Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return { tools };
    });

    // Handle call_tool request
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      logger.info(`Calling tool: ${name}`, { args });

      const tool = this.tools.get(name);
      
      if (!tool) {
        const error = `Unknown tool: ${name}`;
        logger.error(error);
        return {
          content: [
            {
              type: 'text',
              text: formatErrorResponse({
                code: 'TOOL_NOT_FOUND',
                message: error,
              }),
            },
          ],
        };
      }

      try {
        const result = await tool.handler(this.client, args || {});
        
        logger.debug(`Tool ${name} executed successfully`);
        
        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        logger.error(`Tool ${name} failed`, error);
        
        const mcpError = handleApiError(error);
        
        return {
          content: [
            {
              type: 'text',
              text: formatErrorResponse(mcpError),
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    
    logger.info('Starting QA Sphere MCP Server...');
    logger.info(`Registered ${this.tools.size} tools`);
    
    await this.server.connect(transport);
    
    logger.info('QA Sphere MCP Server started successfully');
  }

  /**
   * Get server instance (for testing)
   */
  getServer(): Server {
    return this.server;
  }
}
