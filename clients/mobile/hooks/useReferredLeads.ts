import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

type ReferredLead = {
  refName: string,
  createdAt: Date,
  leadStatus: string,
};

const useReferredLeads = () => {
  return useQuery<ReferredLead[]>({
    queryKey: ['referredLeads'],
    queryFn: async () => {
      const { data } = await apiClient.get('/customer/referred');
      return data;
    },
    throwOnError: true,
  });
};

export default useReferredLeads;
