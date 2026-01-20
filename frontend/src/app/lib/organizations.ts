import { apiClient, ApiResponse } from './api';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

class OrganizationsService {
    async getAllOrganizations(): Promise<Organization[]> {
        const response = await apiClient.get<ApiResponse<Organization[]>>('/organizations');
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch organizations');
    }

    async getOrganizationById(id: string): Promise<Organization> {
        const response = await apiClient.get<ApiResponse<Organization>>(`/organizations/${id}`);
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        throw new Error(response.data.message || 'Failed to fetch organization');
    }
}

export const organizationsService = new OrganizationsService();

