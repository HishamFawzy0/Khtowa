import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProposalService } from '../../core/services/proposal/proposal-service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../core/services/auth/login/login-service';

@Component({
  selector: 'app-proposal-form',
  imports: [ReactiveFormsModule],
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

  ngOnInit(): void {
    this.tutorRequestId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      videoFile: [null, Validators.required],
      message: ['', Validators.required],
      priceOffered: [null, [Validators.required, Validators.min(0)]],
      availableDateTimeList: this.fb.array([
        this.fb.control('', Validators.required),
      ]),
    });
  }

  get availableDateTimeList(): FormArray {
    return this.form.get('availableDateTimeList') as FormArray;
  }

  addDateTime(): void {
    this.availableDateTimeList.push(this.fb.control('', Validators.required));
  }

  removeDateTime(index: number): void {
    this.availableDateTimeList.removeAt(index);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.form.patchValue({ videoFile: file });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
      },
      error: (err) => {
        console.error('Error submitting proposal', err);
      },
    });
  }
}
