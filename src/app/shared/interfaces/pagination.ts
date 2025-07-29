export interface Pagination  {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export interface PaginationResult<T>  {
  metadata: Pagination;
  items: T[];
};
 