// shared/interfaces/proposal.ts
export interface IProposal {
  id: number;
  message: string;
  instructorDisplayName: string;
  videoUrl: string;
  publicId: string;
  priceOffered: number;
  availableDateTimeList: string[];
  rating: number;
}

// shared/interfaces/pagination.ts
