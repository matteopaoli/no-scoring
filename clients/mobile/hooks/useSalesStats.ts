import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

type SalesStats = {
  today: number;
  week: number;
};

const useSalesStats = () => {
  return useQuery<SalesStats>({
    queryKey: ['sales-stats'],
    queryFn: async () => (await apiClient.get('/payment/sales/stats')).data,
  });
};

export default useSalesStats;