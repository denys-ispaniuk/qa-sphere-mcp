import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { Requirement, ListResponse } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all requirement tools
 */
export function getRequirementTools(): MCPTool[] {
  return [
    listRequirementsTool,
    getRequirementTool,
    linkRequirementTool,
  ];
}

/**
 * Tool: List requirements
 */
const listRequirementsTool: MCPTool = {
  name: 'qasphere_list_requirements',
  description: 'Get a list of requirements in a project',
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
    
    const response = await client.get<ListResponse<Requirement>>(
      endpoints.requirements.list(projectId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Get requirement by ID
 */
const getRequirementTool: MCPTool = {
  name: 'qasphere_get_requirement',
  description: 'Get details of a specific requirement by ID',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      requirementId: {
        type: 'string',
        description: 'The ID of the requirement',
      },
    },
    required: ['projectId', 'requirementId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'requirementId']);
    
    const { projectId, requirementId } = args as {
      projectId: string;
      requirementId: string;
    };
    
    const response = await client.get<Requirement>(
      endpoints.requirements.get(projectId, requirementId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Link requirement to test case
 */
const linkRequirementTool: MCPTool = {
  name: 'qasphere_link_requirement',
  description: 'Link a requirement to a test case to establish traceability',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      caseId: {
        type: 'string',
        description: 'The ID of the test case',
      },
      requirementId: {
        type: 'string',
        description: 'The ID of the requirement to link',
      },
    },
    required: ['projectId', 'caseId', 'requirementId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'caseId', 'requirementId']);
    
    const { projectId, caseId, requirementId } = args as {
      projectId: string;
      caseId: string;
      requirementId: string;
    };
    
    const response = await client.post(
      endpoints.requirements.linkToCase(projectId, caseId),
      { requirementId }
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: `Requirement ${requirementId} linked to test case ${caseId} successfully`,
    }, null, 2);
  },
};
