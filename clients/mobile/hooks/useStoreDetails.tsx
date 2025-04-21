import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

type StoreDetails = {
    id: string,
    createdAt: string,
    partnerId: string,
    isSubscriptionActive: string,
    location: unknown,
    geodata: {
        lat: number,
        lng: number,
        placeId: string,
    }
    customerPaysFees: boolean,
    name: string,
    image: string,
    category: string,
    description: string,
    address: string,
};

const useStoreDetails = (storeId: string) => {
  return useQuery<StoreDetails>({
    queryKey: ['storeDetails', storeId],
    queryFn: async () => {
      const response = await apiClient.get(`/store/${storeId}`);
      return response.data;
    }
  });
};

export default useStoreDetails;
