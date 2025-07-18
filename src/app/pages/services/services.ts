import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, HostListener } from '@angular/core';

export interface LessonRequest {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  statusText: string;
  budgetMin: number;
  budgetMax: number;
  deliveryTime: number;
  deliveryTimeUnit: string;
  proposalsCount: number;
  category: string;
  iconBgColor: string;
  iconColor: string;
  iconPath: string;
  client: {
    name: string;
    role: string;
    avatar: string;
  };
  createdAt: Date;
}

export interface NavigationItem {
  label: string;
  url: string;
  active: boolean;
}

export interface Category {
  name: string;
  value: string;
  selected: boolean;
}

@Component({
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css'],
})
export class Services implements OnInit {
  // Component properties
  bannerTitle = 'Available Lesson Requests';
  bannerSubtitle = 'Browse new requests and find your next educational opportunity';
  userAvatar = '/placeholder.svg?height=32&width=32';


  // Filter properties
  searchQuery = '';
  selectedBudget = 500;
  budgetRange = { min: 50, max: 1000 };

  categories: Category[] = [
    { name: 'Programming', value: 'programming', selected: false },
    { name: 'Business & Consulting', value: 'business', selected: false },
    { name: 'Design', value: 'design', selected: false }
  ];
  // Data properties
  lessonRequests: LessonRequest[] = [];
  filteredRequests: LessonRequest[] = [];

  // UI state
  isLoading = true;
  isMobile = false;
  showMobileFilters = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor() { }

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadLessonRequests();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 1024;
    if (!this.isMobile) {
      this.showMobileFilters = false;
    }
  }

  private loadLessonRequests(): void {
    // Simulate API call
    setTimeout(() => {
      this.lessonRequests = [
        {
          id: 1,
          title: 'Expert Python Teacher Needed',
          description: 'Looking for a Python instructor to help with a data analysis project using Pandas, NumPy, and Matplotlib.',
          status: 'open',
          statusText: 'Open',
          budgetMin: 50,
          budgetMax: 150,
          deliveryTime: 7,
          deliveryTimeUnit: 'days',
          proposalsCount: 6,
          category: 'programming',
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          iconPath: 'M3 4a1 1 0 01...',
          client: {
            name: 'Dr. Ibrahim Qasem',
            role: 'Data Science Researcher',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
          },
          createdAt: new Date()
        },
        {
          id: 2,
          title: 'Business Strategy Consultant for a Startup',
          description: 'Looking for a consultant to help develop a market entry strategy for a new tech product in the UAE.',
          status: 'open',
          statusText: 'Open',
          budgetMin: 200,
          budgetMax: 500,
          deliveryTime: 14,
          deliveryTimeUnit: 'days',
          proposalsCount: 3,
          category: 'business',
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          iconPath: 'M13 6a3 3 0 11...',
          client: {
            name: 'Marcus Holloway',
            role: 'Head of Business',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
          },
          createdAt: new Date()
        }, {
          id: 2,
          title: 'Business Strategy Consultant for a Startup',
          description: 'Looking for a consultant to help develop a market entry strategy for a new tech product in the UAE.',
          status: 'open',
          statusText: 'Open',
          budgetMin: 200,
          budgetMax: 500,
          deliveryTime: 14,
          deliveryTimeUnit: 'days',
          proposalsCount: 3,
          category: 'business',
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          iconPath: 'M13 6a3 3 0 11...',
          client: {
            name: 'Marcus Holloway',
            role: 'Head of Business',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
          },
          createdAt: new Date()
        }, {
          id: 2,
          title: 'Business Strategy Consultant for a Startup',
          description: 'Looking for a consultant to help develop a market entry strategy for a new tech product in the UAE.',
          status: 'open',
          statusText: 'Open',
          budgetMin: 200,
          budgetMax: 500,
          deliveryTime: 14,
          deliveryTimeUnit: 'days',
          proposalsCount: 3,
          category: 'business',
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          iconPath: 'M13 6a3 3 0 11...',
          client: {
            name: 'Marcus Holloway',
            role: 'Head of Business',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
          },
          createdAt: new Date()
        }, {
          id: 2,
          title: 'Business Strategy Consultant for a Startup',
          description: 'Looking for a consultant to help develop a market entry strategy for a new tech product in the UAE.',
          status: 'open',
          statusText: 'Open',
          budgetMin: 200,
          budgetMax: 500,
          deliveryTime: 14,
          deliveryTimeUnit: 'days',
          proposalsCount: 3,
          category: 'business',
          iconBgColor: 'bg-purple-100',
          iconColor: 'text-purple-600',
          iconPath: 'M13 6a3 3 0 11...',
          client: {
            name: 'Marcus Holloway',
            role: 'Head of Business',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
          },
          createdAt: new Date()
        },
        {
          id: 3,
          title: 'Digital Marketing Expert for SEO',
          description: 'We need a digital marketing expert specialized in SEO, experienced with Google, SEMrush, and Analytics.',
          status: 'in_progress',
          statusText: 'In Progress',
          budgetMin: 300,
          budgetMax: 600,
          deliveryTime: 21,
          deliveryTimeUnit: 'days',
          proposalsCount: 8,
          category: 'business',
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          iconPath: 'M3 3a1 1 0 00...',
          client: {
            name: 'John Doe',
            role: 'Head of Marketing',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
          },
          createdAt: new Date()
        },
        {
          id: 4,
          title: 'UI/UX Designer for Mobile App',
          description: 'Looking for a designer to create and develop a mobile app UI using modern tools like Figma and Adobe XD.',
          status: 'closed',
          statusText: 'Closed',
          budgetMin: 100,
          budgetMax: 300,
          deliveryTime: 10,
          deliveryTimeUnit: 'days',
          proposalsCount: 12,
          category: 'design',
          iconBgColor: 'bg-orange-100',
          iconColor: 'text-orange-600',
          iconPath: 'M3 5a2 2 0 01...',
          client: {
            name: 'Khalil Abouzeid',
            role: 'Head of Technology',
            avatar: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=400&q=80'
          },
          createdAt: new Date()
        }
      ];


      this.filteredRequests = [...this.lessonRequests];
      this.calculatePagination();
      this.isLoading = false;
    }, 1000);
  }

  // Filter methods
  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onBudgetChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.lessonRequests];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query) ||
        request.client.name.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    const selectedCategories = this.categories
      .filter(cat => cat.selected)
      .map(cat => cat.value);

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(request =>
        selectedCategories.includes(request.category)
      );
    }

    // Apply budget filter
    filtered = filtered.filter(request =>
      request.budgetMin <= this.selectedBudget &&
      request.budgetMax >= this.selectedBudget
    );

    this.filteredRequests = filtered;
    this.currentPage = 1;
    this.calculatePagination();
  }

  // UI methods
  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  getStatusBadgeClass(status: string): string {
    const baseClasses = 'text-xs font-medium px-2.5 py-0.5 rounded-full';
    switch (status) {
      case 'open':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'in_progress':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'closed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getActionButtonClass(status: string): string {
    const baseClasses = 'px-4 py-2 rounded-md text-sm transition duration-200';
    switch (status) {
      case 'open':
        return `${baseClasses} bg-teal-600 text-white hover:bg-teal-700`;
      case 'in_progress':
        return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
      case 'closed':
        return `${baseClasses} bg-gray-100 text-gray-700 cursor-not-allowed`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  }

  getActionButtonText(status: string): string {
    switch (status) {
      case 'open':
        return 'Submit Proposal';
      case 'in_progress':
        return 'View Details';
      case 'closed':
        return 'Closed';
      default:
        return 'View Details';
    }
  }

  onActionClick(request: LessonRequest): void {
    if (request.status === 'closed') return;

    if (request.status === 'open') {
      // Handle proposal submission
      console.log('Submit proposal for:', request.title);
      // Navigate to proposal form or open modal
    } else {
      // Handle view details
      console.log('View details for:', request.title);
      // Navigate to details page
    }
  }

  // Pagination methods
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Utility methods
  trackByRequestId(index: number, request: LessonRequest): number {
    return request.id;
  }
}