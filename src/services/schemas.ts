import { z } from "zod";

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
