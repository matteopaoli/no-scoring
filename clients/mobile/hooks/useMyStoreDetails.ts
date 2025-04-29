import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

type MerchantStoreDetails = {
  id: string;
  name: string;
  image: string;
  address: string;
  totalRevenue: number;
  salesCount: number;
  customerPaysFees: boolean;
};

const useMyStoreDetails = () => {
  return useQuery<MerchantStoreDetails>({
    queryKey: ['myStore'],
    queryFn: async () => (await apiClient.get('/store/me')).data,
  });
};

export default useMyStoreDetails;
