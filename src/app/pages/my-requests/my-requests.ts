import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MyRequestService } from '../../core/services/myRequest/my-request-service';
import { TutorRequest } from '../../shared/interfaces/tutor-request';
import { Pagination } from '../../shared/interfaces/pagination';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './my-requests.html',
  styleUrl: './my-requests.css',
})
export class MyRequests {
  id: string = '';
  route = inject(ActivatedRoute);
  _MyRequests = inject(MyRequestService);

  requestList: TutorRequest[] = [];
  metadata!: Pagination;

  // pagination
  currentPage = 1;
  pageSize = 4;
  totalItems = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadRequests();
  }

  loadRequests(): void {
    this._MyRequests
      .GetTutorRequests(
        { pageNumber: this.currentPage, pageSize: this.pageSize },
        this.id
      )
      .subscribe({
        next: (data) => {
          this.requestList = data.items;
          this.metadata = data.metadata;
          this.totalItems = data.metadata.totalCount;
          // this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.totalPages = data.metadata.totalPages;
        },
        error: (err) => {
          console.error('Failed to load tutor request:', err);
        },
      });
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRequests();
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];

    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      if (this.currentPage <= 3) {
        pages.push(1, 2, 3, '...', this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(
          1,
          '...',
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages
        );
      } else {
        pages.push(1, '...', this.currentPage, '...', this.totalPages);
      }
    }

    return pages;
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}
