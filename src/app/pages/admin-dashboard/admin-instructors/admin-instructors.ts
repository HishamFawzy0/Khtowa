import { Component, inject, OnInit, signal } from '@angular/core';
import { InstructorService } from '../../../core/services/instructor/instructor-service';
import { InstructorAdminData } from '../../../shared/interfaces/instructor-admin-data';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../shared/interfaces/pagination';

@Component({
  selector: 'app-admin-instructors',
  imports: [CommonModule],
  templateUrl: './admin-instructors.html',
  styleUrl: './admin-instructors.css'
})
export class AdminInstructors implements OnInit {
  protected instructorService = inject(InstructorService);
  protected instructors = signal<InstructorAdminData[]>([]);
  protected metaData = signal<Pagination | null>(null);
  protected filterStatus: boolean | null = null;
  protected pageNumber = 1;
  protected pageSize = 10;
  protected processingIds = signal<Set<string>>(new Set());
  protected isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadInstructors();
  }

  loadInstructors() {
    this.isLoading.set(true);
    this.instructorService.getInstructorsForAdmin(this.pageSize, this.pageNumber, this.filterStatus).subscribe({
      next: (data) => {
        this.instructors.set(data.items);
        this.metaData.set(data.metaData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load instructors:', err);
        this.isLoading.set(false);
      }
    });
  }

  acceptInstructor(instructorId: string) {
    this.processingIds.update(ids => new Set(ids).add(instructorId));

    this.instructorService.acceptInstructor(instructorId).subscribe({
      next: () => {
        this.processingIds.update(ids => {
          ids.delete(instructorId);
          return new Set(ids);
        });
        this.loadInstructors();
      },
      error: (err) => {
        console.error('Failed to accept instructor:', err);
        this.processingIds.update(ids => {
          ids.delete(instructorId);
          return new Set(ids);
        });
      }
    });
  }

  rejectInstructor(instructorId: string) {
    this.processingIds.update(ids => new Set(ids).add(instructorId));

    this.instructorService.rejectInstructor(instructorId).subscribe({
      next: () => {
        this.processingIds.update(ids => {
          ids.delete(instructorId);
          return new Set(ids);
        });
        this.loadInstructors();
      },
      error: (err) => {
        console.error('Failed to reject instructor:', err);
        this.processingIds.update(ids => {
          ids.delete(instructorId);
          return new Set(ids);
        });
      }
    });
  }

  toggleInstructorVerification(instructorId: string) {
    this.processingIds.update(ids => new Set(ids).add(instructorId));

    this.instructorService.toggleInstructorVerification(instructorId).subscribe({
      next: () => {
        this.processingIds.update(ids => {
          ids.delete(instructorId);
          return new Set(ids);
        });
        this.loadInstructors();
      },
      error: (err) => {
        console.error('Failed to toggle instructor verification:', err);
        this.processingIds.update(ids => {
          ids.delete(instructorId);
          return new Set(ids);
        });
      }
    });
  }

  changeFilter(status: boolean | null) {
    this.filterStatus = status;
    this.pageNumber = 1;
    this.loadInstructors();
  }

  goToPage(page: number) {
    this.pageNumber = page;
    this.loadInstructors();
  }

  getStatusColor(isVerified: boolean | null): string {
    if (isVerified === null) return 'bg-amber-100 text-amber-700 border-amber-200';
    return isVerified
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : 'bg-red-100 text-red-700 border-red-200';
  }

  getStatusText(isVerified: boolean | null): string {
    if (isVerified === null) return 'Pending Review';
    return isVerified ? 'Verified' : 'Rejected';
  }

  getStatusIcon(isVerified: boolean | null): string {
    if (isVerified === null) return '⏳';
    return isVerified ? '✅' : '❌';
  }

  isProcessing(instructorId: string): boolean {
    return this.processingIds().has(instructorId);
  }
}
