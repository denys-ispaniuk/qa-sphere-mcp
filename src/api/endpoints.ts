/**
 * QA Sphere API endpoint definitions
 */

export const endpoints = {
  // Projects
  projects: {
    list: '/projects',
    get: (id: string) => `/projects/${id}`,
  },

  // Test Cases
  testCases: {
    list: (projectId: string) => `/projects/${projectId}/cases`,
    get: (projectId: string, caseId: string) => `/projects/${projectId}/cases/${caseId}`,
    create: (projectId: string) => `/projects/${projectId}/cases`,
    update: (projectId: string, caseId: string) => `/projects/${projectId}/cases/${caseId}`,
    delete: (projectId: string, caseId: string) => `/projects/${projectId}/cases/${caseId}`,
    steps: {
      list: (projectId: string, caseId: string) => `/projects/${projectId}/cases/${caseId}/steps`,
      create: (projectId: string, caseId: string) => `/projects/${projectId}/cases/${caseId}/steps`,
    },
  },

  // Folders
  folders: {
    list: (projectId: string) => `/projects/${projectId}/folders`,
    get: (projectId: string, folderId: string) => `/projects/${projectId}/folders/${folderId}`,
    create: (projectId: string) => `/projects/${projectId}/folders`,
    update: (projectId: string, folderId: string) => `/projects/${projectId}/folders/${folderId}`,
    delete: (projectId: string, folderId: string) => `/projects/${projectId}/folders/${folderId}`,
  },

  // Tags
  tags: {
    list: (projectId: string) => `/projects/${projectId}/tags`,
    create: (projectId: string) => `/projects/${projectId}/tags`,
    update: (projectId: string, tagId: string) => `/projects/${projectId}/tags/${tagId}`,
    delete: (projectId: string, tagId: string) => `/projects/${projectId}/tags/${tagId}`,
  },

  // Preconditions
  preconditions: {
    list: (projectId: string) => `/projects/${projectId}/preconditions`,
    create: (projectId: string) => `/projects/${projectId}/preconditions`,
    update: (projectId: string, preconditionId: string) => 
      `/projects/${projectId}/preconditions/${preconditionId}`,
  },

  // Test Plans
  testPlans: {
    list: (projectId: string) => `/projects/${projectId}/plans`,
    get: (projectId: string, planId: string) => `/projects/${projectId}/plans/${planId}`,
    create: (projectId: string) => `/projects/${projectId}/plans`,
  },

  // Requirements
  requirements: {
    list: (projectId: string) => `/projects/${projectId}/requirements`,
    get: (projectId: string, reqId: string) => `/projects/${projectId}/requirements/${reqId}`,
    linkToCase: (projectId: string, caseId: string) => 
      `/projects/${projectId}/cases/${caseId}/links/requirements`,
  },
};
