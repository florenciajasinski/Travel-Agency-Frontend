import { z } from "zod";

import { DEFAULT_PAGE_SIZE } from "@/constants";

const paginatedResponseSchema = z.object({
  meta: z.object({
    lastPage: z.number(),
    perPage: z.number(),
    total: z.number(),
  }),
});

export const parsePaginatedResponse = <T>(schema: z.ZodType<T>, response: unknown) => {
  return paginatedResponseSchema.extend({ data: schema }).parse(response);
};

export const formatListResponse = <T>(schema: z.ZodType<T>, raw: unknown, initialPage = 1) => {
  const rawObject = raw as { data?: unknown; meta?: unknown };
  const items = rawObject.data ?? raw;
  const parsed = z.array(schema).parse(items);

  const meta = rawObject.meta || {
    currentPage: initialPage,
    perPage: parsed.length,
    total: parsed.length,
    lastPage: 1,
    from: 1,
    to: parsed.length,
  };

  return {
    data: parsed,
    meta,
  };
};

export const getList = (
  list?: {
    meta?: {
      last_page?: number;
      lastPage?: number;
      per_page?: number;
      perPage?: number;
      total?: number;
    };
  },
  defaultPageSize = DEFAULT_PAGE_SIZE,
) => {
  const m = list?.meta ?? {};

  return {
    lastPage: m.last_page ?? m.lastPage,
    pageSize: m.per_page ?? m.perPage ?? defaultPageSize,
    totalItems: m.total ?? 0,
  };
};

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const toDateInput = (s?: string) => {
  return s ? new Date(s).toISOString().slice(0, 10) : "";
};
