/**
 * Common API types for QA Sphere
 */

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestCase {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  folderId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'draft' | 'ready' | 'deprecated';
  steps?: TestStep[];
  preconditionIds?: string[];
  tagIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TestStep {
  id?: string;
  action: string;
  expectedResult?: string;
  order?: number;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  projectId: string;
  createdAt?: string;
}

export interface Precondition {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestPlan {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  testCaseIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Requirement {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API Request types
 */

export interface CreateTestCaseRequest {
  title: string;
  description?: string;
  folderId?: string;
  priority?: string;
  status?: string;
  steps?: Array<{
    action: string;
    expectedResult?: string;
  }>;
  preconditionIds?: string[];
  tagIds?: string[];
}

export interface UpdateTestCaseRequest extends Partial<CreateTestCaseRequest> {
  id: string;
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateFolderRequest extends Partial<CreateFolderRequest> {
  id: string;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface CreatePreconditionRequest {
  title: string;
  description?: string;
}

export interface CreateTestPlanRequest {
  name: string;
  description?: string;
  testCaseIds?: string[];
}

/**
 * API Response types
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export interface ListResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  success: false;
}
