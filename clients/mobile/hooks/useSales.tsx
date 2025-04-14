import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

const useSales = () => {
  return useQuery<unknown[]>({
    queryKey: ['sales'],
    queryFn: async () => (await apiClient.get('/payment/sales')).data.data,
  });
};

export default useSales;
