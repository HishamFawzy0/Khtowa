import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../../core/services/category/category-service';
import { ICategory } from '../../../shared/interfaces/icategory';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories implements OnInit {
  protected categoryService = inject(CategoryService);
  protected categorys = signal<ICategory[]>([]);

  activeTab = 'list';
  editCategoryId: number | null = null;
  updatedCategoryName = '';
  newCategoryName = '';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categorys.set(data);
        console.log('Categories loaded successfully:', data);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  addCategory(categoryName: string) {
    if (!categoryName?.trim() || categoryName.length < 2) {
      return;
    }

    this.categoryService.createCategory(categoryName.trim()).subscribe({
      next: (data) => {
        console.log('Category added successfully:', data);
        // Reload categories to get the updated list
        this.loadCategories();
        // Clear the form and switch to list view
        this.newCategoryName = '';
        this.activeTab = 'list';
      },
      error: (err) => {
        console.error('Error adding category:', err);
      }
    });
  }

  updateCategoryName(categoryId: number, categoryName: string) {
    if (!categoryName?.trim() || categoryName.length < 2) {
      return;
    }

    this.categoryService.updateCategoryName(categoryId, categoryName.trim()).subscribe({
      next: (data) => {
        console.log('Category updated successfully:', data);
        // Reload categories to get the updated list
        this.loadCategories();
        // Clear edit state
        this.editCategoryId = null;
        this.updatedCategoryName = '';
      },
      error: (err) => {
        console.error('Error updating category:', err);
      }
    });
  }

  deleteCategory(categoryId: number) {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (data) => {
        console.log('Category deleted successfully:', data);
        // Reload categories to get the updated list
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error deleting category:', err);
      }
    });
  }

  // Helper method to cancel editing
  cancelEdit() {
    this.editCategoryId = null;
    this.updatedCategoryName = '';
  }

  // Helper method to clear the create form
  clearCreateForm() {
    this.newCategoryName = '';
  }
}