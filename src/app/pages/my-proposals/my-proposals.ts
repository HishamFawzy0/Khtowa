import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProposalsService } from '../../core/services/my-proposals/my-proposals-service';
import { LoginService } from '../../core/services/auth/login/login-service';

interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
interface PagedResponse<T> {
  items: T[];
  metadata: PaginationMetadata;
}
// TODO: غيّر أي خصائص حسب شكل الـ Proposal عندك
interface Proposal {
  id: number;
  message: string;
  instructorDisplayName: string;
  videoUrl: string;
  publicId: string;
  priceOffered: number;
  availableDateTimeList: string[];
}



@Component({
  selector: 'app-my-proposals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-proposals.html',
  styleUrl: './my-proposals.css',
})
export class MyProposals {
  private _my = inject(MyProposalsService);
  private _login = inject(LoginService);

  userID!: string;

  proposals: Proposal[] = [];
  meta: PaginationMetadata = {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  };
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.userID = this._login.userData.nameid;
    this.loadPage(1);
  }

  loadPage(page: number) {
    if (this.loading) return;
    this.loading = true;
    this.error = null;

    this._my
      .getInstructorProposals(this.userID, page, this.meta.pageSize)
      .subscribe({
        next: (res: PagedResponse<Proposal>) => {
          this.proposals = res.items ?? [];
          this.meta = res.metadata ?? this.meta;
          this.loading = false;
          console.log(this.proposals);
          
        },
        error: (err) => {
          this.error = 'Failed to load proposals';
          console.error(err);
          this.loading = false;
        },
      });
  }

  setPageSize(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.meta.pageSize = value;
    this.loadPage(1);
  }

  get pages(): number[] {
    const total = this.meta.totalPages || 1;
    const cur = this.meta.currentPage || 1;

    // نافذة صفحات بسيطة حوالين الصفحة الحالية
    const span = 2;
    const start = Math.max(1, cur - span);
    const end = Math.min(total, cur + span);

    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }

  get showingFrom() {
    return this.meta.totalCount === 0
      ? 0
      : (this.meta.currentPage - 1) * this.meta.pageSize + 1;
  }
  get showingTo() {
    return Math.min(
      this.meta.currentPage * this.meta.pageSize,
      this.meta.totalCount
    );
  }

  trackById = (_: number, p: Proposal) => p.id;
}
