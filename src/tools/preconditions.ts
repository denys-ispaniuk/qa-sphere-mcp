import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { Precondition, ListResponse, CreatePreconditionRequest } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all precondition tools
 */
export function getPreconditionTools(): MCPTool[] {
  return [
    listPreconditionsTool,
    createPreconditionTool,
  ];
}

/**
 * Tool: List preconditions
 */
const listPreconditionsTool: MCPTool = {
  name: 'qasphere_list_preconditions',
  description: 'Get a list of shared preconditions in a project that can be reused across test cases',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
    },
    required: ['projectId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId']);
    
    const { projectId } = args as { projectId: string };
    
    const response = await client.get<ListResponse<Precondition>>(
      endpoints.preconditions.list(projectId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Create precondition
 */
const createPreconditionTool: MCPTool = {
  name: 'qasphere_create_precondition',
  description: 'Create a new shared precondition that can be reused across multiple test cases',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      title: {
        type: 'string',
        description: 'The title of the precondition',
      },
      description: {
        type: 'string',
        description: 'Optional: Detailed description of the precondition',
      },
    },
    required: ['projectId', 'title'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'title']);
    
    const { projectId, ...preconditionData } = args as unknown as {
      projectId: string;
    } & CreatePreconditionRequest;
    
    const response = await client.post<Precondition>(
      endpoints.preconditions.create(projectId),
      preconditionData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Precondition created successfully',
    }, null, 2);
  },
};
