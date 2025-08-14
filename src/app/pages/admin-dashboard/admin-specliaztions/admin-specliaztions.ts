import { Component, inject, signal } from '@angular/core';
import { Specialization } from '../../../core/services/specialization/specialization';
import { ISpecialization } from '../../../shared/interfaces/ispecialization';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-specliaztions',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-specliaztions.html',
  styleUrl: './admin-specliaztions.css'
})
export class AdminSpecliaztions {
  protected specializationService = inject(Specialization);
  protected specliaztions = signal<ISpecialization[]>([]);

  activeTab = 'list';
  editSpecializationId: number | null = null;
  updatedSpecializationName = '';
  newSpecializationName = '';

  ngOnInit() {
    this.loadSpecliaztions();
  }

  loadSpecliaztions() {
    this.specializationService.getSpecialization().subscribe({
      next: (data) => {
        this.specliaztions.set(data);
        console.log('Categories loaded successfully:', data);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  addSpecialization(specializationName: string) {
    if (!specializationName?.trim() || specializationName.length < 2) {
      return;
    }

    this.specializationService.createSpecialization(specializationName.trim()).subscribe({
      next: (data) => {
        console.log('Specialization added successfully:', data);
        this.loadSpecliaztions();
        this.newSpecializationName = '';
        this.activeTab = 'list';
      },
      error: (err) => {
        console.error('Error adding specialization:', err);
      }
    });
  }

  updateSpecializationName(specializationId: number, specializationName: string) {
    if (!specializationName?.trim() || specializationName.length < 2) {
      return;
    }

    this.specializationService.updateSpecializationName(specializationId, specializationName.trim()).subscribe({
      next: (data) => {
        console.log('Category updated successfully:', data);
        this.loadSpecliaztions();
        this.editSpecializationId = null;
        this.updatedSpecializationName = '';
      },
      error: (err) => {
        console.error('Error updating category:', err);
      }
    });
  }

  deleteSpecliaztion(specializationId: number) {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    this.specializationService.deleteSpecialization(specializationId).subscribe({
      next: (data) => {
        console.log('Category deleted successfully:', data);
        this.loadSpecliaztions();
      },
      error: (err) => {
        console.error('Error deleting category:', err);
      }
    });
  }

  // Helper method to cancel editing
  cancelEdit() {
    this.editSpecializationId = null;
    this.updatedSpecializationName = '';
  }

  // Helper method to clear the create form
  clearCreateForm() {
    this.newSpecializationName = '';
  }
}
