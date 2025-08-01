import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { RequestParams, UseMutationProps, UseQueryProps } from "@/services/types";
import { mutations, queries } from "./factories";
import type { UserFilterKey } from "./types";

export const useUsersListQuery = (
  params: RequestParams<Record<UserFilterKey, string | undefined>>,
  props?: UseQueryProps<typeof queries.list>,
) => {
  return useQuery({ ...queries.list(params), ...props });
};

export const useUsersDeleteMutation = (props?: UseMutationProps<typeof mutations.delete>) => {
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

export const useCreateUserMutation = (props?: UseMutationProps<typeof mutations.create>) => {
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

export const useUpdateUserMutation = (props?: UseMutationProps<typeof mutations.update>) => {
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
