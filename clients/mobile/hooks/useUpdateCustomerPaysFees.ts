import apiClient from "@/lib/httpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useMyStoreDetails from "./useMyStoreDetails";
import { Toast } from "toastify-react-native";

export const useUpdateCustomerPaysFees = () => {
    const queryClient = useQueryClient();
    const { data: store } = useMyStoreDetails();
  
    return useMutation({
      mutationFn: async (customerPaysFees: boolean) => {
        if (!store) {
          throw new Error("Store not found");
        }
        return await apiClient.post(`/store/${store.id}/set-fees`, {
          customerPaysFees,
        });
      },
      onSuccess: () => {
        Toast.success('Impostazione aggiornata con successo!', "bottom");
        queryClient.invalidateQueries({ queryKey: ['myStore'] });
      },
    });
  };