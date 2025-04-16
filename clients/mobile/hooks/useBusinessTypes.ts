import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

type BusinessCategory = {
  id: number,
  name: string
}

// Custom Hook to Fetch Business Types
const useBusinessTypes = () => {
  return useQuery<BusinessCategory[]>({
    queryKey: ['businessTypes'],
    queryFn: async () => (await apiClient.get('/business-type')).data,
  });
};

export default useBusinessTypes;
