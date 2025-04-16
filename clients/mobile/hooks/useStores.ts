import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';
import { useLocation } from '@/contexts/LocationContext';

type Store = {
  id: string;
  name: string;
  category: string;
  image: string;
};

type FetchStoresParams = {
  query?: string;
  category?: string;
};

// Unified fetch function for both nearby and search
const fetchStores = async ({
  query,
  category,
  lat,
  lng,
}: FetchStoresParams & { lat: number; lng: number }) => {
  const endpoint = query ? '/store/search' : '/store/nearby';

  const params: Record<string, any> = {
    lat,
    lng,
    limit: 20,
  };

  if (query) params.q = query;
  if (category) params.category = category;

  const response = await apiClient.get(endpoint, { params });
  return response.data;
};

const useStores = ({ query = '', category = '' }: FetchStoresParams = {}) => {
  const { location } = useLocation();
  const queryClient = useQueryClient();

  const canFetch = !!location && !query; // auto-fetch nearby only when no search query

  const { data: stores, isLoading, refetch } = useQuery<Store[]>({
    queryKey: ['stores', { category, lat: location?.latitude, lng: location?.longitude }],
    queryFn: () =>
      fetchStores({
        lat: location!.latitude,
        lng: location!.longitude,
        category,
      }),
    enabled: canFetch,
  });

  const { mutateAsync: searchStores, isPending: isSearching } = useMutation({
    mutationFn: () =>
      fetchStores({
        query,
        category,
        lat: location!.latitude,
        lng: location!.longitude,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(['stores', { category, lat: location?.latitude, lng: location?.longitude }], data);
    },
  });

  return {
    stores,
    isLoading: isLoading || isSearching,
    searchStores,
    refetch,
  };
};

export default useStores;
