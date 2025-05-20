import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

type Region = {
  id: number,
  name: string,
  areaId: number,
};

const useRegions = () => {
  return useQuery<Region[]>({
    queryKey: ['regions',], // react-query will refetch if limit or offset changes
    queryFn: async () => {
      const { data } = await apiClient.get('/geolocation/regions');
      return data;
    }
  });
};

export default useRegions;
