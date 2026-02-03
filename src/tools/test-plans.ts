import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { TestPlan, ListResponse, CreateTestPlanRequest } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all test plan tools
 */
export function getTestPlanTools(): MCPTool[] {
  return [
    listTestPlansTool,
    getTestPlanTool,
    createTestPlanTool,
  ];
}

/**
 * Tool: List test plans
 */
const listTestPlansTool: MCPTool = {
  name: 'qasphere_list_test_plans',
  description: 'Get a list of test plans in a project',
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
    
    const response = await client.get<ListResponse<TestPlan>>(
      endpoints.testPlans.list(projectId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Get test plan by ID
 */
const getTestPlanTool: MCPTool = {
  name: 'qasphere_get_test_plan',
  description: 'Get details of a specific test plan by ID',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      planId: {
        type: 'string',
        description: 'The ID of the test plan',
      },
    },
    required: ['projectId', 'planId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'planId']);
    
    const { projectId, planId } = args as { projectId: string; planId: string };
    
    const response = await client.get<TestPlan>(
      endpoints.testPlans.get(projectId, planId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Create test plan
 */
const createTestPlanTool: MCPTool = {
  name: 'qasphere_create_test_plan',
  description: 'Create a new test plan to group and organize test cases',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      name: {
        type: 'string',
        description: 'The name of the test plan',
      },
      description: {
        type: 'string',
        description: 'Optional: Description of the test plan',
      },
      testCaseIds: {
        type: 'array',
        description: 'Optional: Array of test case IDs to include in the plan',
        items: { type: 'string' },
      },
    },
    required: ['projectId', 'name'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'name']);
    
    const { projectId, ...planData } = args as unknown as {
      projectId: string;
    } & CreateTestPlanRequest;
    
    const response = await client.post<TestPlan>(
      endpoints.testPlans.create(projectId),
      planData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Test plan created successfully',
    }, null, 2);
  },
};
