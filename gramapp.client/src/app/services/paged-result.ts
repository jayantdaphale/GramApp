export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export function normalizePagedResult<T = any>(response: any): PagedResult<T> {
  const source = response?.body
    ?? response?.data
    ?? response?.Data
    ?? response?.result
    ?? response?.Result
    ?? response;

  const rawItems = source?.items
    ?? source?.Items
    ?? source?.$values
    ?? (Array.isArray(source) ? source : []);

  const items = Array.isArray(rawItems)
    ? rawItems
    : rawItems?.$values ?? [];

  return {
    items,
    page: source?.page ?? source?.Page ?? 1,
    pageSize: source?.pageSize ?? source?.PageSize ?? items.length,
    totalCount: source?.totalCount
      ?? source?.TotalCount
      ?? source?.count
      ?? source?.Count
      ?? items.length
  };
}
