import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { Project, ListResponse } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all project tools
 */
export function getProjectTools(): MCPTool[] {
  return [
    listProjectsTool,
    getProjectTool,
  ];
}

/**
 * Tool: List all projects
 */
const listProjectsTool: MCPTool = {
  name: 'qasphere_list_projects',
  description: 'Get a list of all projects in QA Sphere',
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
  handler: async (client: QASphereClient) => {
    const response = await client.get<ListResponse<Project>>(endpoints.projects.list);
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Get project by ID
 */
const getProjectTool: MCPTool = {
  name: 'qasphere_get_project',
  description: 'Get details of a specific project by ID',
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
    
    const response = await client.get<Project>(endpoints.projects.get(projectId));
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};
