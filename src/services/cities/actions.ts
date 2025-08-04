import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { RequestParams, UseMutationProps, UseQueryProps } from "@/services/types";
import { mutations, queries } from "./factories";
import type { CityFilterKey } from "./types";

export const useCitiesListQuery = (
  params: RequestParams<Record<CityFilterKey, string | undefined>>,
  props?: UseQueryProps<typeof queries.list>,
) => {
  return useQuery({ ...queries.list(params), ...props });
};

export const useCitiesDeleteMutation = (props?: UseMutationProps<typeof mutations.delete>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.delete,
    ...props,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      props?.onSuccess?.(...args);
    },
  });
};

export const useCreateCityMutation = (props?: UseMutationProps<typeof mutations.create>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.create,
    ...props,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      props?.onSuccess?.(...args);
    },
  });
};

export const useUpdateCityMutation = (props?: UseMutationProps<typeof mutations.update>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.update,
    ...props,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queries.list._def });
      props?.onSuccess?.(...args);
    },
  });
};

export const useAirlineCitiesQuery = (
  params: {
    airlineId: string;
    filter?: Record<string, string | undefined>;
    page?: number;
  },
  props?: UseQueryProps<typeof queries.airlineCities>,
) => {
  return useQuery({ ...queries.airlineCities(params), ...props });
};
