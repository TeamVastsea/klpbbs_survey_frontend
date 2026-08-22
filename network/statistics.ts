import { baseFetcher } from '@/network/base';

export interface AdminStatistics {
  surveys: number;
  available_surveys: number;
  submissions: number;
  recent_submissions: number;
  users: number;
}

export default class StatisticsNetwork {
  public static fetchStatistics = baseFetcher<AdminStatistics>('/api/statistics', 'GET', true);
}
