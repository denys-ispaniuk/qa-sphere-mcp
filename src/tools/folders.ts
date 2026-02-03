import { QASphereClient } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';
import { Folder, ListResponse, CreateFolderRequest, UpdateFolderRequest } from '../api/types.js';
import { MCPTool } from '../server.js';
import { validateRequiredParams } from '../utils/error-handler.js';

/**
 * Get all folder tools
 */
export function getFolderTools(): MCPTool[] {
  return [
    listFoldersTool,
    getFolderTool,
    createFolderTool,
    updateFolderTool,
    deleteFolderTool,
  ];
}

/**
 * Tool: List folders
 */
const listFoldersTool: MCPTool = {
  name: 'qasphere_list_folders',
  description: 'Get a list of folders in a project for organizing test cases',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      parentId: {
        type: 'string',
        description: 'Optional: Filter by parent folder ID to get subfolders',
      },
    },
    required: ['projectId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId']);
    
    const { projectId, parentId } = args as { projectId: string; parentId?: string };
    
    const params: Record<string, string> = {};
    if (parentId) params.parentId = parentId;
    
    const response = await client.get<ListResponse<Folder>>(
      endpoints.folders.list(projectId),
      { params }
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Get folder by ID
 */
const getFolderTool: MCPTool = {
  name: 'qasphere_get_folder',
  description: 'Get details of a specific folder by ID',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      folderId: {
        type: 'string',
        description: 'The ID of the folder',
      },
    },
    required: ['projectId', 'folderId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'folderId']);
    
    const { projectId, folderId } = args as { projectId: string; folderId: string };
    
    const response = await client.get<Folder>(
      endpoints.folders.get(projectId, folderId)
    );
    
    return JSON.stringify({
      success: true,
      data: response,
    }, null, 2);
  },
};

/**
 * Tool: Create folder
 */
const createFolderTool: MCPTool = {
  name: 'qasphere_create_folder',
  description: 'Create a new folder in a project to organize test cases',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      name: {
        type: 'string',
        description: 'The name of the folder',
      },
      description: {
        type: 'string',
        description: 'Optional: Description of the folder',
      },
      parentId: {
        type: 'string',
        description: 'Optional: ID of the parent folder (for creating subfolders)',
      },
    },
    required: ['projectId', 'name'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'name']);
    
    const { projectId, ...folderData } = args as unknown as { projectId: string } & CreateFolderRequest;
    
    const response = await client.post<Folder>(
      endpoints.folders.create(projectId),
      folderData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Folder created successfully',
    }, null, 2);
  },
};

/**
 * Tool: Update folder
 */
const updateFolderTool: MCPTool = {
  name: 'qasphere_update_folder',
  description: 'Update an existing folder',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      folderId: {
        type: 'string',
        description: 'The ID of the folder to update',
      },
      name: {
        type: 'string',
        description: 'The name of the folder',
      },
      description: {
        type: 'string',
        description: 'Optional: Description of the folder',
      },
      parentId: {
        type: 'string',
        description: 'Optional: ID of the parent folder (for moving folder)',
      },
    },
    required: ['projectId', 'folderId', 'name'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'folderId', 'name']);
    
    const { projectId, folderId, ...updateData } = args as unknown as {
      projectId: string;
      folderId: string;
    } & UpdateFolderRequest;
    
    const response = await client.put<Folder>(
      endpoints.folders.update(projectId, folderId),
      updateData
    );
    
    return JSON.stringify({
      success: true,
      data: response,
      message: 'Folder updated successfully',
    }, null, 2);
  },
};

/**
 * Tool: Delete folder
 */
const deleteFolderTool: MCPTool = {
  name: 'qasphere_delete_folder',
  description: 'Delete a folder from the project. Note: This may fail if the folder contains test cases.',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: {
        type: 'string',
        description: 'The ID of the project',
      },
      folderId: {
        type: 'string',
        description: 'The ID of the folder to delete',
      },
    },
    required: ['projectId', 'folderId'],
  },
  handler: async (client: QASphereClient, args: Record<string, unknown>) => {
    validateRequiredParams(args, ['projectId', 'folderId']);
    
    const { projectId, folderId } = args as { projectId: string; folderId: string };
    
    await client.delete(endpoints.folders.delete(projectId, folderId));
    
    return JSON.stringify({
      success: true,
      message: `Folder ${folderId} deleted successfully`,
    }, null, 2);
  },
};
