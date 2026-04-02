import api from '@/lib/api';
import { handleApiError } from '@/lib/error';

export interface IContentSection {
  _id?: string;
  title: string;
  content: string;
  listItems: string[];
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IContentSectionListResponse {
  success: boolean;
  data: IContentSection[];
  message?: string;
}

export interface IContentSectionResponse {
  success: boolean;
  data: IContentSection;
  message?: string;
}

/**
 * Get all content sections
 */
export const getContentSections = async (): Promise<IContentSectionListResponse> => {
  try {
    const response = await api.get<IContentSectionListResponse>('/content-sections');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch content sections');
    throw error;
  }
};

/**
 * Get a single content section by ID
 */
export const getContentSection = async (id: string): Promise<IContentSectionResponse> => {
  try {
    const response = await api.get<IContentSectionResponse>(`/content-sections/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch content section');
    throw error;
  }
};

/**
 * Create a new content section
 */
export const createContentSection = async (
  data: Omit<IContentSection, '_id' | 'createdAt' | 'updatedAt'>
): Promise<IContentSectionResponse> => {
  try {
    const response = await api.post<IContentSectionResponse>('/content-sections', data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to create content section');
    throw error;
  }
};

/**
 * Update a content section
 */
export const updateContentSection = async (
  id: string,
  data: Partial<Omit<IContentSection, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<IContentSectionResponse> => {
  try {
    const response = await api.put<IContentSectionResponse>(`/content-sections/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update content section');
    throw error;
  }
};

/**
 * Delete a content section
 */
export const deleteContentSection = async (id: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await api.delete<{ success: boolean; message?: string }>(`/content-sections/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to delete content section');
    throw error;
  }
};


