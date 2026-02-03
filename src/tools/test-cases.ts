import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { TestCase, ListResponse, CreateTestCaseRequest, UpdateTestCaseRequest } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all test case tools
 */
export function getTestCaseTools(): MCPTool[] {
  return [
    listTestCasesTool,
    getTestCaseTool,
    createTestCaseTool,
    updateTestCaseTool,
    patchTestCaseTool,
    deleteTestCaseTool,
  ];
}

/**
 * Tool: List test cases
 */
const listTestCasesTool: MCPTool = {
  name: 'qasphere_list_test_cases',
  description: 'Get a list of test cases in a project. You can filter by folder, tags, or other criteria.',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      folderId: {
        type: 'number',
        description: 'Optional: Filter by folder ID',
      },
      page: {
        type: 'number',
        description: 'Optional: Page number for pagination',
      },
      pageSize: {
        type: 'number',
        description: 'Optional: Number of items per page',
      },
    },
    required: ['projectId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId']);
    
    const { projectId, folderId, page, pageSize } = args as {
      projectId: string;
      folderId?: number;
      page?: number;
      pageSize?: number;
    };
    
    const params: Record<string, string | number> = {};
    if (folderId) params.folderId = folderId;
    if (page) params.page = page;
    if (pageSize) params.pageSize = pageSize;
    
    const response = await client.get<ListResponse<TestCase>>(
      endpoints.testCases.list(projectId),
      { params }
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Get test case by ID
 */
const getTestCaseTool: MCPTool = {
  name: 'qasphere_get_test_case',
  description: 'Get details of a specific test case by ID',
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
    },
    required: ['projectId', 'caseId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'caseId']);
    
    const { projectId, caseId } = args as { projectId: string; caseId: string };
    
    const response = await client.get<TestCase>(
      endpoints.testCases.get(projectId, caseId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Create test case
 */
const createTestCaseTool: MCPTool = {
  name: 'qasphere_create_test_case',
  description: 'Create a new test case in a project',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      title: {
        type: 'string',
        description: 'The title of the test case',
      },
      description: {
        type: 'string',
        description: 'Optional: Description of the test case',
      },
      folderId: {
        type: 'number',
        description: 'Optional: ID of the folder to place the test case in',
      },
      priority: {
        type: 'string',
        description: 'Optional: Priority (low, medium, high, critical)',
        enum: ['low', 'medium', 'high', 'critical'],
      },
      status: {
        type: 'string',
        description: 'Optional: Status (draft, ready, deprecated)',
        enum: ['draft', 'ready', 'deprecated'],
      },
      steps: {
        type: 'array',
        description: 'Optional: Test steps',
        items: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              description: 'The action to perform',
            },
            expectedResult: {
              type: 'string',
              description: 'Expected result of the action',
            },
          },
          required: ['action'],
        },
      },
      preconditionIds: {
        type: 'array',
        description: 'Optional: Array of precondition IDs',
        items: { type: 'string' },
      },
      tagIds: {
        type: 'array',
        description: 'Optional: Array of tag IDs',
        items: { type: 'string' },
      },
    },
    required: ['projectId', 'title'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'title']);
    
    const { projectId, ...testCaseData } = args as unknown as { projectId: string } & CreateTestCaseRequest;
    
    const response = await client.post<TestCase>(
      endpoints.testCases.create(projectId),
      testCaseData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Test case created successfully',
    }, null, 2);
  },
};

/**
 * Tool: Update test case (full update)
 */
const updateTestCaseTool: MCPTool = {
  name: 'qasphere_update_test_case',
  description: 'Update an existing test case (replaces all fields)',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      caseId: {
        type: 'string',
        description: 'The ID of the test case to update',
      },
      title: {
        type: 'string',
        description: 'The title of the test case',
      },
      description: {
        type: 'string',
        description: 'Optional: Description of the test case',
      },
      folderId: {
        type: 'string',
        description: 'Optional: ID of the folder',
      },
      priority: {
        type: 'string',
        description: 'Optional: Priority (low, medium, high, critical)',
        enum: ['low', 'medium', 'high', 'critical'],
      },
      status: {
        type: 'string',
        description: 'Optional: Status (draft, ready, deprecated)',
        enum: ['draft', 'ready', 'deprecated'],
      },
      steps: {
        type: 'array',
        description: 'Optional: Test steps',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            expectedResult: { type: 'string' },
          },
          required: ['action'],
        },
      },
      preconditionIds: {
        type: 'array',
        description: 'Optional: Array of precondition IDs',
        items: { type: 'string' },
      },
      tagIds: {
        type: 'array',
        description: 'Optional: Array of tag IDs',
        items: { type: 'string' },
      },
    },
    required: ['projectId', 'caseId', 'title'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'caseId', 'title']);
    
    const { projectId, caseId, ...updateData } = args as unknown as {
      projectId: string;
      caseId: string;
    } & UpdateTestCaseRequest;
    
    const response = await client.put<TestCase>(
      endpoints.testCases.update(projectId, caseId),
      updateData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Test case updated successfully',
    }, null, 2);
  },
};

/**
 * Tool: Patch test case (partial update)
 */
const patchTestCaseTool: MCPTool = {
  name: 'qasphere_patch_test_case',
  description: 'Partially update a test case (only specified fields)',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      caseId: {
        type: 'string',
        description: 'The ID of the test case to update',
      },
      title: {
        type: 'string',
        description: 'Optional: The title of the test case',
      },
      description: {
        type: 'string',
        description: 'Optional: Description of the test case',
      },
      folderId: {
        type: 'string',
        description: 'Optional: ID of the folder',
      },
      priority: {
        type: 'string',
        description: 'Optional: Priority (low, medium, high, critical)',
        enum: ['low', 'medium', 'high', 'critical'],
      },
      status: {
        type: 'string',
        description: 'Optional: Status (draft, ready, deprecated)',
        enum: ['draft', 'ready', 'deprecated'],
      },
      preconditionIds: {
        type: 'array',
        description: 'Optional: Array of precondition IDs',
        items: { type: 'string' },
      },
      tagIds: {
        type: 'array',
        description: 'Optional: Array of tag IDs',
        items: { type: 'string' },
      },
    },
    required: ['projectId', 'caseId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'caseId']);
    
    const { projectId, caseId, ...patchData } = args as {
      projectId: string;
      caseId: string;
    } & Partial<UpdateTestCaseRequest>;
    
    const response = await client.patch<TestCase>(
      endpoints.testCases.update(projectId, caseId),
      patchData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Test case patched successfully',
    }, null, 2);
  },
};

/**
 * Tool: Delete test case
 */
const deleteTestCaseTool: MCPTool = {
  name: 'qasphere_delete_test_case',
  description: 'Delete a test case from the project',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      caseId: {
        type: 'string',
        description: 'The ID of the test case to delete',
      },
    },
    required: ['projectId', 'caseId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'caseId']);
    
    const { projectId, caseId } = args as { projectId: string; caseId: string };
    
    await client.delete(endpoints.testCases.delete(projectId, caseId));
    
    return JSON.stringify({
      success: true,
      message: `Test case ${caseId} deleted successfully`,
    }, null, 2);
  },
};
