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
  pageSize = 10;
  pageNumber = 1;
  filterStatus: boolean | null = null;

  ngOnInit(): void {
      this.loadInstructors();
  }

  loadInstructors() {
    this.instructorService.getInstructorsForAdmin(this.pageSize, this.pageNumber).subscribe({
      next: (res) => {
        console.log(res.items);
        console.log(res.metadata);
        this.instructors.set(res.items);
        this.metaData.set(res.metadata);
      },
      error: (err) => {
        console.error('Failed to load instructors:', err);
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
}
