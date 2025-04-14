import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

// Custom Hook to Fetch Business Types
const useBusinessTypes = () => {
  return useQuery({
    queryKey: ['businessTypes'],
    queryFn: async () => (await apiClient.get('/business-type')).data,
  });
};

export default useBusinessTypes;
