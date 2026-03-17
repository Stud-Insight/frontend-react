import apiHandle from '../api/ApiHandle';

export interface DashboardPhase {
    label: string;
    start_date: string;
    end_date: string;
    progress: number;
}

export const DashboardService = {
    getCurrentPhases: async (): Promise<DashboardPhase[]> => {
        const response = await apiHandle.get('/ter/current-phases/');
        return response.data;
    },

    getStats: async (): Promise<DashboardStats> => {
        const response = await apiHandle.get('/ter/dashboard-stats/');
        return response.data;
    }   
};

export interface DashboardStats {
    groupsFormed: number;
    totalGroupsExpected: number;
    solitaires: number;
    incompleteGroups: number;
    rankingsDone: number;
}

