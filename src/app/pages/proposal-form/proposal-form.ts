import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from '../../core/services/proposal/proposal-service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { LoginService } from '../../core/services/auth/login/login-service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
 

@Component({
  selector: 'app-proposal-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './proposal-form.html',
  styleUrl: './proposal-form.css',
})
export class ProposalForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private proposalService = inject(ProposalService);
  private loginService = inject(LoginService);

  protected form!: FormGroup;
  protected tutorRequestId!: number;
  protected user = this.loginService.userData;
  protected selectedFile: File | null = null;
  protected isSubmitting = false;
  protected isDragOver = false;
  protected suggestedPrices = [15, 20, 25, 30, 35, 40, 50];
 
  router = inject(Router);

  ngOnInit(): void {
    this.tutorRequestId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      videoFile: [null, [Validators.required, this.fileValidator.bind(this)]],
      message: ['', [Validators.required, Validators.minLength(20)]],
      priceOffered: [
        null,
        [
          Validators.required,
          Validators.min(5),
          Validators.max(200),
          this.priceValidator,
        ],
      ],
      availableDateTimeList: this.fb.array([
        this.fb.control('', [Validators.required, this.futureDateValidator]),
      ]),
    });
  }

  // Custom Validators
  private fileValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (!file) return { required: true };

    const validTypes = [
      'video/mp4',
      'video/mov',
      'video/avi',
      'video/quicktime',
    ];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(file.type)) {
      return { invalidFileType: true };
    }

    if (file.size > maxSize) {
      return { fileTooLarge: true };
    }

    return null;
  }

  private priceValidator(control: AbstractControl): ValidationErrors | null {
    const price = control.value;
    if (!price) return null;

    if (price < 5) return { tooLow: true };
    if (price > 200) return { tooHigh: true };

    // Check for reasonable decimal places
    const decimalPlaces = (price.toString().split('.')[1] || '').length;
    if (decimalPlaces > 2) return { tooManyDecimals: true };

    return null;
  }

  private futureDateValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const date = control.value;
    if (!date) return { required: true };

    const selectedDate = new Date(date);
    const now = new Date();
    const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    if (selectedDate <= now) {
      return { pastDate: true };
    }

    if (selectedDate < minDate) {
      return { tooSoon: true };
    }

    return null;
  }

  get availableDateTimeList(): FormArray {
    return this.form.get('availableDateTimeList') as FormArray;
  }

  addDateTime(): void {
    const newControl = this.fb.control('', [
      Validators.required,
      this.futureDateValidator,
    ]);
    this.availableDateTimeList.push(newControl);
  }

  removeDateTime(index: number): void {
    if (this.availableDateTimeList.length > 1) {
      this.availableDateTimeList.removeAt(index);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.processFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.processFile(file);
    }
  }

  private processFile(file: File | undefined): void {
    if (file) {
      this.selectedFile = file;
      this.form.patchValue({ videoFile: file });
      this.form.get('videoFile')?.markAsTouched();
      this.form.get('videoFile')?.updateValueAndValidity();
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.form.patchValue({ videoFile: null });
    this.form.get('videoFile')?.markAsTouched();
    this.form.get('videoFile')?.updateValueAndValidity();
  }

  setSuggestedPrice(price: number): void {
    this.form.patchValue({ priceOffered: price });
    this.form.get('priceOffered')?.markAsTouched();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getMinDateTime(): string {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().slice(0, 16);
  }

  getFormProgress(): number {
    const fields = ['videoFile', 'message', 'priceOffered'];
    const validFields = fields.filter((field) => {
      const control = this.form.get(field);
      return control?.valid;
    }).length;

    const validDateTimes = this.availableDateTimeList.controls.filter(
      (ctrl) => ctrl.valid
    ).length;
    const hasValidDateTime = validDateTimes > 0 ? 1 : 0;

    const totalFields = fields.length + 1; // +1 for date/time array
    const completedFields = validFields + hasValidDateTime;

    return Math.round((completedFields / totalFields) * 100);
  }

  // Error message helpers
  getVideoFileError(): string {
    const control = this.form.get('videoFile');
    if (control?.errors) {
      if (control.errors['required']) return 'Video file is required';
      if (control.errors['invalidFileType'])
        return 'Please select a valid video file (MP4, MOV, AVI)';
      if (control.errors['fileTooLarge'])
        return 'File size must be less than 100MB';
    }
    return 'Video file is required';
  }

  getMessageError(): string {
    const control = this.form.get('message');
    if (control?.errors) {
      if (control.errors['required']) return 'Message is required';
      if (control.errors['minlength'])
        return 'Message must be at least 20 characters';
    }
    return 'Message is required';
  }

  getPriceError(): string {
    const control = this.form.get('priceOffered');
    if (control?.errors) {
      if (control.errors['required']) return 'Price is required';
      if (control.errors['tooLow']) return 'Price must be at least $5 per hour';
      if (control.errors['tooHigh']) return 'Price cannot exceed $200 per hour';
      if (control.errors['tooManyDecimals'])
        return 'Price can have at most 2 decimal places';
    }
    return 'Valid price is required';
  }

  getDateTimeError(index: number): string {
    const control = this.availableDateTimeList.at(index);
    if (control?.errors) {
      if (control.errors['required']) return 'Date and time required';
      if (control.errors['pastDate']) return 'Cannot select past date';
      if (control.errors['tooSoon'])
        return 'Must be at least 24 hours from now';
    }
    return 'Valid date and time required';
  }

  submit(): void {
    if (this.form.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('TutorRequestID', this.tutorRequestId.toString());
    formData.append('InstructorId', this.user.nameid);
    formData.append('VideoFile', this.form.value.videoFile);
    formData.append('Message', this.form.value.message);
    formData.append('PriceOffered', this.form.value.priceOffered.toString());

    this.availableDateTimeList.controls.forEach((ctrl, index) => {
      formData.append(`AvailableDateTimeList[${index}]`, ctrl.value);
    });

    this.proposalService.createProposal(formData).subscribe({
      next: (res) => {
        console.log('Proposal submitted successfully', res);
        this.handleSubmissionSuccess();
        Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Request submitted successfully ✅',
                  showConfirmButton: false,
                  timer: 2000,
                  timerProgressBar: true,
                }).then(() => {
                  this.router.navigate(['/services']);
                });
      },
      error: (err) => {
        console.error('Error submitting proposal', err);
        this.handleSubmissionError();
      },
    });
  }

  private markAllFieldsAsTouched(): void {
    this.form.markAllAsTouched();
    this.availableDateTimeList.controls.forEach((control) => {
      control.markAsTouched();
    });
  }

  private handleSubmissionSuccess(): void {
    this.isSubmitting = false;
    // Add success notification or redirect logic here
    console.log('Proposal submitted successfully!');
  }

  private handleSubmissionError(): void {
    this.isSubmitting = false;
    // Add error handling logic here
    console.error('Failed to submit proposal. Please try again.');
  }
}