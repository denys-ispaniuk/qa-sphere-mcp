import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { TestPlan, ListResponse, CreateTestPlanRequest } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all test plan tools
 * Note: Public API only supports creating test plans, not listing or getting them
 */
export function getTestPlanTools(): MCPTool[] {
  return [
    createTestPlanTool,
  ];
}

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
