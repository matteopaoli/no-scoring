import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';
import { useLocation } from '@/contexts/LocationContext';

type Store = {
  id: string;
  name: string;
  category: string;
  image: string;
  distance: number;
};

type UseStoresOptions = {
  query?: string;
  category?: string;
  limit?: number;
  radius?: number; // Optional if you want to support this too
};

const fetchStores = async ({
  pageParam = 0,
  query,
  category,
  lat,
  lng,
  limit = 20,
  radius,
}: {
  pageParam?: number;
  query?: string;
  category?: string;
  lat: number;
  lng: number;
  limit?: number;
  radius?: number;
}): Promise<Store[]> => {
  const params: Record<string, any> = {
    lat,
    lng,
    limit,
    offset: pageParam,
  };

  if (query) params.q = query;
  if (category) params.category = category;
  if (radius) params.radius = radius;

  const response = await apiClient.get('/store/search', { params });
  return response.data;
};

const useStores = ({ query, category, limit = 20, radius }: UseStoresOptions = {}) => {
  const { location } = useLocation();
  const canFetch = !!location;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Store[]>({
    queryKey: ['stores', { query, category, radius, lat: location?.latitude, lng: location?.longitude }],
    queryFn: ({ pageParam = 0 }) =>
      fetchStores({
        pageParam: pageParam as number,
        query,
        category,
        radius,
        lat: location!.latitude,
        lng: location!.longitude,
        limit,
      }),
    enabled: canFetch,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit ? undefined : allPages.length * limit,
  });

  const stores = data?.pages.flat() ?? [];

  return {
    stores,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};

export default useStores;
