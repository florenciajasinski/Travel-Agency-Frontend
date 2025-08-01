import * as Sentry from "@sentry/react";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      throwOnError: (error) => {
        Sentry.captureException(error);

        return false;
      },
    },
  },
});
