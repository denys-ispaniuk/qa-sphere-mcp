import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { Tag, ListResponse, CreateTagRequest } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all tag tools
 */
export function getTagTools(): MCPTool[] {
  return [
    listTagsTool,
    createTagTool,
    updateTagTool,
    deleteTagTool,
  ];
}

/**
 * Tool: List tags
 */
const listTagsTool: MCPTool = {
  name: 'qasphere_list_tags',
  description: 'Get a list of tags in a project for categorizing test cases',
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
    
    const response = await client.get<ListResponse<Tag>>(
      endpoints.tags.list(projectId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Create tag
 */
const createTagTool: MCPTool = {
  name: 'qasphere_create_tag',
  description: 'Create a new tag in a project for categorizing test cases',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      name: {
        type: 'string',
        description: 'The name of the tag',
      },
      color: {
        type: 'string',
        description: 'Optional: Color code for the tag (e.g., #FF5733)',
      },
    },
    required: ['projectId', 'name'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'name']);
    
    const { projectId, ...tagData } = args as unknown as { projectId: string } & CreateTagRequest;
    
    const response = await client.post<Tag>(
      endpoints.tags.create(projectId),
      tagData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Tag created successfully',
    }, null, 2);
  },
};

/**
 * Tool: Update tag
 */
const updateTagTool: MCPTool = {
  name: 'qasphere_update_tag',
  description: 'Update an existing tag',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      tagId: {
        type: 'string',
        description: 'The ID of the tag to update',
      },
      name: {
        type: 'string',
        description: 'The name of the tag',
      },
      color: {
        type: 'string',
        description: 'Optional: Color code for the tag (e.g., #FF5733)',
      },
    },
    required: ['projectId', 'tagId', 'name'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'tagId', 'name']);
    
    const { projectId, tagId, ...updateData } = args as {
      projectId: string;
      tagId: string;
      name: string;
      color?: string;
    };
    
    const response = await client.put<Tag>(
      endpoints.tags.update(projectId, tagId),
      updateData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Tag updated successfully',
    }, null, 2);
  },
};

/**
 * Tool: Delete tag
 */
const deleteTagTool: MCPTool = {
  name: 'qasphere_delete_tag',
  description: 'Delete a tag from the project',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      tagId: {
        type: 'string',
        description: 'The ID of the tag to delete',
      },
    },
    required: ['projectId', 'tagId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'tagId']);
    
    const { projectId, tagId } = args as { projectId: string; tagId: string };
    
    await client.delete(endpoints.tags.delete(projectId, tagId));
    
    return JSON.stringify({
      success: true,
      message: `Tag ${tagId} deleted successfully`,
    }, null, 2);
  },
};
