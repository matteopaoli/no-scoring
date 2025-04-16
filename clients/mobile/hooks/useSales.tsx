import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';
import type { Stripe } from 'stripe';

type Sale = {
  stripe: Stripe.Response<Stripe.PaymentIntent> | null | undefined;
  id: string;
  storeId: string;
  amount: string;
  createdAt: Date | null;
  stripePaymentIntentId: string;
};

const useSales = (limit = 10, offset = 0) => {
  return useQuery<Sale[]>({
    queryKey: ['sales', limit, offset], // react-query will refetch if limit or offset changes
    queryFn: async () => {
      const { data } = await apiClient.get('/payment/sales', {
        params: { limit, offset },
      });
      return data;
    },
    placeholderData: (prev) => prev, // helpful for smooth pagination
  });
};

export default useSales;
