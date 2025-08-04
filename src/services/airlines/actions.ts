import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { RequestParams, UseMutationProps, UseQueryProps } from "@/services/types";
import { mutations, queries } from "./factories";
import type { AirlineFilterKey } from "./types";

export const useAirlinesListQuery = (
  params: RequestParams<Record<AirlineFilterKey, string | undefined>>,
  props?: UseQueryProps<typeof queries.list>,
) => {
  return useQuery({ ...queries.list(params), ...props });
};

export const useAllAirlinesQuery = (props?: UseQueryProps<typeof queries.all>) => {
  return useQuery({
    ...queries.all(),
    ...props,
  });
};

export const useAirlinesDeleteMutation = (props?: UseMutationProps<typeof mutations.delete>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.delete,
    ...props,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      queryClient.invalidateQueries({ queryKey: queries.all._def });
      props?.onSuccess?.(...args);
    },
  });
};

export const useCreateAirlineMutation = (props?: UseMutationProps<typeof mutations.create>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.create,
    ...props,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      queryClient.invalidateQueries({ queryKey: queries.all._def });
      props?.onSuccess?.(...args);
    },
  });
};

export const useUpdateAirlineMutation = (props?: UseMutationProps<typeof mutations.update>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.update,
    ...props,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      queryClient.invalidateQueries({ queryKey: queries.all._def });
      props?.onSuccess?.(...args);
    },
  });
};
