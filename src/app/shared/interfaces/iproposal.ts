// shared/interfaces/proposal.ts
export interface IProposal {
  id: number;
  message: string;
  instructorDisplayName: string;
  videoUrl: string;
  publicId: string;
  priceOffered: number;
  availableDateTimeList: string[];
}

// shared/interfaces/pagination.ts
export interface Metadata {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationResult<T> {
  metadata: Metadata;
  items: T[];
}