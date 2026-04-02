import api from '@/lib/api';
import { handleApiError } from '@/lib/error';

// Banner Zone Types
export interface IBannerZone {
  _id?: string;
  name: string;
  zone: string;
  type: 'banner' | 'carousel';
  status: 'active' | 'inactive' | 'scheduled';
  scheduling?: {
    startDate?: string;
    endDate?: string;
    timezone?: string;
  };
  targeting?: {
    brands?: string[];
    markets?: string[];
    devices?: ('mobile' | 'desktop' | 'tablet')[];
    segments?: string[];
  };
  items?: Array<{
    bannerId?: string;
    providerId?: string;
    imageUrl: string;
    linkUrl?: string;
    title?: string;
    description?: string;
    displayOrder: number;
  }>;
  version?: number;
  preview?: {
    desktop?: string;
    mobile?: string;
  };
  cdnPurgeHooks?: string[];
}

export interface IBannerZoneListResponse {
  success: boolean;
  rows: IBannerZone[];
  pagination: {
    totalPages: number;
    currentPage: number;
    total: number;
  };
}

// Policy Page Types
export interface IPolicyPageVersion {
  _id?: string;
  version: number;
  content: string;
  reviewDate?: string;
  nextReviewDate?: string;
  publishedAt?: string;
  publishedBy?: string;
  status: 'draft' | 'published' | 'archived';
  changeLog?: string;
}

export interface IPolicyPage {
  _id?: string;
  type: 'terms' | 'privacy' | 'aml-kyc' | 'responsible-gaming';
  currentVersion: number;
  versions: IPolicyPageVersion[];
  isActive: boolean;
  currentVersionContent?: IPolicyPageVersion;
}

// Winners Feed Types
export interface IWinnersFeedSettings {
  _id?: string;
  isEnabled: boolean;
  inclusionCriteria: {
    minWinAmount: number;
    minBetAmount?: number;
    gameCategories?: string[];
    excludeGameIds?: string[];
    excludeProviderIds?: string[];
    timeRange?: {
      hours: number;
    };
  };
  maskRules: {
    maskUsername: boolean;
    maskPattern?: 'partial' | 'full';
    showAmount: boolean;
    showGame: boolean;
    showTime: boolean;
  };
  displaySettings: {
    maxItems: number;
    refreshInterval?: number;
    featuredWinners?: string[];
    hiddenWinners?: string[];
  };
  analytics: {
    totalDisplayed: number;
    lastUpdated?: string;
    views?: number;
  };
}

// Banner Zone API
export const getBannerZones = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}): Promise<IBannerZoneListResponse> => {
  try {
    const response = await api.get<IBannerZoneListResponse>('/cms/banner-zones', { params });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch banner zones');
    throw error;
  }
};

export const getBannerZoneById = async (id: string): Promise<{ success: boolean; zone: IBannerZone }> => {
  try {
    const response = await api.get<{ success: boolean; zone: IBannerZone }>(`/cms/banner-zones/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch banner zone');
    throw error;
  }
};

export const createBannerZone = async (data: IBannerZone): Promise<{ success: boolean; zone: IBannerZone }> => {
  try {
    const response = await api.post<{ success: boolean; zone: IBannerZone }>('/cms/banner-zones', data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to create banner zone');
    throw error;
  }
};

export const updateBannerZone = async (
  id: string,
  data: Partial<IBannerZone>
): Promise<{ success: boolean; zone: IBannerZone }> => {
  try {
    const response = await api.put<{ success: boolean; zone: IBannerZone }>(`/cms/banner-zones/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update banner zone');
    throw error;
  }
};

export const deleteBannerZone = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<{ success: boolean }>(`/cms/banner-zones/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to delete banner zone');
    throw error;
  }
};

export const purgeCDN = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<{ success: boolean }>(`/cms/banner-zones/${id}/purge-cdn`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to purge CDN');
    throw error;
  }
};

// Policy Page API
export const getPolicyPages = async (): Promise<{ success: boolean; pages: IPolicyPage[] }> => {
  try {
    const response = await api.get<{ success: boolean; pages: IPolicyPage[] }>('/cms/policy-pages');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch policy pages');
    throw error;
  }
};

export const getPolicyPageByType = async (
  type: string
): Promise<{ success: boolean; page: IPolicyPage }> => {
  try {
    const response = await api.get<{ success: boolean; page: IPolicyPage }>(`/cms/policy-pages/${type}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch policy page');
    throw error;
  }
};

export const createPolicyPageVersion = async (data: {
  type: string;
  content: string;
  reviewDate?: string;
  nextReviewDate?: string;
  changeLog?: string;
  publish?: boolean;
}): Promise<{ success: boolean; version: IPolicyPageVersion; page: IPolicyPage }> => {
  try {
    const response = await api.post<{ success: boolean; version: IPolicyPageVersion; page: IPolicyPage }>(
      '/cms/policy-pages/versions',
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to create policy page version');
    throw error;
  }
};

export const publishPolicyPageVersion = async (
  id: string
): Promise<{ success: boolean; version: IPolicyPageVersion; page: IPolicyPage }> => {
  try {
    const response = await api.post<{ success: boolean; version: IPolicyPageVersion; page: IPolicyPage }>(
      `/cms/policy-pages/versions/${id}/publish`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to publish policy page version');
    throw error;
  }
};

// Winners Feed API
export const getWinnersFeedSettings = async (): Promise<{
  success: boolean;
  settings: IWinnersFeedSettings;
}> => {
  try {
    const response = await api.get<{ success: boolean; settings: IWinnersFeedSettings }>(
      '/cms/winners-feed/settings'
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch winners feed settings');
    throw error;
  }
};

export const updateWinnersFeedSettings = async (
  data: Partial<IWinnersFeedSettings>
): Promise<{ success: boolean; settings: IWinnersFeedSettings }> => {
  try {
    const response = await api.put<{ success: boolean; settings: IWinnersFeedSettings }>(
      '/cms/winners-feed/settings',
      data
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update winners feed settings');
    throw error;
  }
};

export const getWinners = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{ success: boolean; winners: any[]; pagination: any }> => {
  try {
    const response = await api.get<{ success: boolean; winners: any[]; pagination: any }>(
      '/cms/winners-feed/winners',
      { params }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch winners');
    throw error;
  }
};

export const featureWinner = async (transactionId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<{ success: boolean }>('/cms/winners-feed/feature', { transactionId });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to feature winner');
    throw error;
  }
};

export const hideWinner = async (transactionId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<{ success: boolean }>('/cms/winners-feed/hide', { transactionId });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to hide winner');
    throw error;
  }
};

export const exportWinnersAnalytics = async (): Promise<{ success: boolean; analytics: any }> => {
  try {
    const response = await api.get<{ success: boolean; analytics: any }>('/cms/winners-feed/export');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to export winners analytics');
    throw error;
  }
};


