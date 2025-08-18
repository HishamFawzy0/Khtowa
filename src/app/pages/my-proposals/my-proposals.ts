import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  MyProposalsService,
  PagedResponse,
  PaginationMetadata,
  Proposal,
} from '../../core/services/my-proposals/my-proposals-service';
import { LoginService } from '../../core/services/auth/login/login-service';

@Component({
  selector: 'app-my-proposals',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  // null = All (مش هيبعت ProposalStatus)
  statusFilter: number | null = 0;

  ngOnInit() {
    this.userID = this._login.userData.nameid;
    this.loadPage(1);
  }

  loadPage(page: number) {
    if (this.loading) return;
    this.loading = true;
    this.error = null;

    this._my
      .getInstructorProposals(
        this.userID,
        page,
        this.meta.pageSize,
        this.statusFilter ?? undefined
      )
      .subscribe({
        next: (res: PagedResponse<Proposal>) => {
          this.proposals = res?.items ?? [];
          this.meta = res?.metadata ?? this.meta;
          this.loading = false;
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

  applyStatusFilter(status: number | null) {
    if (this.statusFilter === status) return;
    this.statusFilter = status;
    this.loadPage(1);
  }

  statusLabel(s: number): string {
    switch (s) {
      case 0:
        return 'Submitted';
      case 2:
        return 'Accepted';
      case 3:
        return 'Rejected';
      default:
        return 'Submitted';
    }
  }

  get pages(): number[] {
    const total = this.meta.totalPages || 1;
    const cur = this.meta.currentPage || 1;
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
