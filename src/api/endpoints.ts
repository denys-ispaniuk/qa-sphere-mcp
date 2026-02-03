/**
 * QA Sphere API endpoint definitions
 */

export const endpoints = {
  // Projects
  projects: {
    list: '/project',
    get: (id: string) => `/project/${id}`,
  },

  // Test Cases
  testCases: {
    list: (projectId: string) => `/project/${projectId}/tcase`,
    get: (projectId: string, caseId: string) => `/project/${projectId}/tcase/${caseId}`,
    create: (projectId: string) => `/project/${projectId}/tcase`,
    update: (projectId: string, caseId: string) => `/project/${projectId}/tcase/${caseId}`,
    delete: (projectId: string, caseId: string) => `/project/${projectId}/tcase/${caseId}`,
    steps: {
      list: (projectId: string, caseId: string) => `/project/${projectId}/tcase/${caseId}/steps`,
      create: (projectId: string, caseId: string) => `/project/${projectId}/tcase/${caseId}/steps`,
    },
  },

  // Folders
  folders: {
    list: (projectId: string) => `/project/${projectId}/tcase/folders`,
    get: (projectId: string, folderId: string) => `/project/${projectId}/tcase/folder/${folderId}`,
    create: (projectId: string) => `/project/${projectId}/tcase/folder`,
    update: (projectId: string, folderId: string) => `/project/${projectId}/tcase/folder/${folderId}`,
    delete: (projectId: string, folderId: string) => `/project/${projectId}/tcase/folder/${folderId}`,
  },

  // Tags
  tags: {
    list: (projectId: string) => `/project/${projectId}/tag`,
    create: (projectId: string) => `/project/${projectId}/tag`,
    update: (projectId: string, tagId: string) => `/project/${projectId}/tag/${tagId}`,
    delete: (projectId: string, tagId: string) => `/project/${projectId}/tag/${tagId}`,
  },

  // Preconditions
  preconditions: {
    list: (projectId: string) => `/project/${projectId}/shared-precondition`,
    create: (projectId: string) => `/project/${projectId}/shared-precondition`,
    update: (projectId: string, preconditionId: string) => 
      `/project/${projectId}/shared-precondition/${preconditionId}`,
  },

  // Test Plans
  testPlans: {
    // Note: Public API only supports creating test plans, not listing or getting them
    create: (projectId: string) => `/project/${projectId}/plan`,
  },

  // Requirements
  requirements: {
    list: (projectId: string) => `/project/${projectId}/requirement`,
    get: (projectId: string, reqId: string) => `/project/${projectId}/requirement/${reqId}`,
    linkToCase: (projectId: string, caseId: string) => 
      `/project/${projectId}/tcase/${caseId}/requirement`,
  },
};
