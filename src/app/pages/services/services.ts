import { LoginService } from './../../core/services/auth/login/login-service';
import { TutorRequest } from './../../shared/interfaces/tutor-request';
import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category/category-service';
import { ICategory } from '../../shared/interfaces/icategory';
import { TutorRequestService } from '../../core/services/tutorRequest/tutor-request-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

export interface TutorRequestFilter {
  pageNumber: number;
  pageSize: number;
  title?: string;
  categoryIds?: number[];
  minBudget?: number;
  maxBudget?: number;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],

  templateUrl: 'services.html',
  styleUrls: ['services.css'],
})
export class Services implements OnInit {
  // Services
  GetCategory = inject(CategoryService);
  getTutorRequests = inject(TutorRequestService);
  LoginService = inject(LoginService);

  // Data
  categoryList: ICategory[] = [];
  TutorRequestList: TutorRequest[] = [];
  filteredRequests: TutorRequest[] = [];
  userData = this.LoginService.userData;

  // Filter properties
  searchTitle: string = '';
  selectedCategories: number[] = [];
  budgetRange: number[] = [5, 1000];

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  // Math reference for template
  Math = Math;

  // Store all data for client-side filtering
  allTutorRequests: TutorRequest[] = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadCategories();
    this.loadTutorRequests();
  }

  loadCategories(): void {
    this.GetCategory.getCategories().subscribe({
      next: (data) => {
        this.categoryList = data;
        console.log('Categories loaded:', this.categoryList);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  totalCount!: number;

  loadTutorRequests(): void {
    this.isLoading = true;

    const filter: TutorRequestFilter = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      categoryIds: this.selectedCategories.length
        ? this.selectedCategories
        : undefined,
    };

    console.log('📦 API Filter:', filter);

    this.getTutorRequests.GetTutorRequests(filter).subscribe({
      next: (data) => {
        this.allTutorRequests = data.items; // ✅ تخزين كل الطلبات
        this.totalItems = data.metadata.totalCount;
        this.totalPages = data.metadata.totalPages;
        this.isLoading = false;

        this.filterAndPaginate(); // ✅ فلترة بعد التحميل
      },
      error: (err) => {
        console.error('Error fetching tutor requests:', err);
        this.TutorRequestList = [];
        this.filteredRequests = [];
        this.isLoading = false;
      },
    });
  }

  filterAndPaginate(): void {
    const title = this.searchTitle.toLowerCase().trim();

    let filtered = this.allTutorRequests.filter((item) => {
      const matchTitle =
        item.title.toLowerCase().includes(title) ||
        item.description.toLowerCase().includes(title);

      const matchCategory =
        this.selectedCategories.length === 0 ||
        this.selectedCategories.includes(
          this.getCategoryIdByName(item.categoryName)
        );

      return matchTitle && matchCategory;
    });

    // تحديث العدد الكلي
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    // Pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredRequests = filtered.slice(startIndex, endIndex);
  }

  onCategoryChange(event: any): void {
    const categoryId = parseInt(event.target.value);
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (id) => id !== categoryId
      );
    }

    this.currentPage = 1;
    this.filterAndPaginate(); // ✅ فلترة محلية
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.filterAndPaginate(); // ✅ فلترة محلية بدون API call
  }

  private getCategoryIdByName(categoryName: string): number {
    const category = this.categoryList.find((cat) => cat.name === categoryName);
    return category ? category.id : 0;
  }

  paginateResults(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredRequests = this.TutorRequestList.slice(startIndex, endIndex);
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.selectedCategories = [];
    this.budgetRange = [5, 1000];
    this.currentPage = 1;

    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox) => (checkbox.checked = false));

    this.filterAndPaginate(); // ✅ تصفية محلية بدون API call
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.filterAndPaginate();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadTutorRequests();
    }
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (this.currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i);
        }
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  // Helper method for template
  isCurrentPage(page: number | string): boolean {
    return page === this.currentPage;
  }
}
