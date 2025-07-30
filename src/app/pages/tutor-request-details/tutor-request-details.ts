import {  Component, inject, OnInit } from '@angular/core';
import { STutorRequestDetails } from '../../core/services/TutorRequestDetails/stutor-request-details';
import { TutorRequest } from '../../shared/interfaces/tutor-request';
import { IProposal } from '../../shared/interfaces/iproposal';
import { Pagination, PaginationResult } from '../../shared/interfaces/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoginService } from '../../core/services/auth/login/login-service';
import { UserDecodedToken } from '../../shared/interfaces/user-decoded-token';

@Component({
  selector: 'app-tutor-request-details',
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './tutor-request-details.html',
  styleUrl: './tutor-request-details.css',
})
export class TutorRequestDetails implements OnInit {
  id!: number;
  request: TutorRequest | null = null;
  proposals!: IProposal[] ;
  totalProposals: number = 0;
  currentPage: number = 1; 
  pageSize: number = 5;
  
  metadata: Pagination={
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
  };
  pageNumber = 1;
  userData!:UserDecodedToken

  _loginService=inject(LoginService)

  constructor(
    private tutorRequestService: STutorRequestDetails,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.userData= this._loginService.userData;

    this.tutorRequestService.getTutorRequest(this.id).subscribe({
      next: (data) => {
        this.request = data;
        this.loadProposals();
      },
      error: (err) => {
        console.error('Failed to load tutor request:', err);
      },
    });
    
  }
  loadProposals(): void {
    this.tutorRequestService
      .getProposals(this.id, this.pageNumber, this.pageSize)
      .subscribe((res) => {
        this.proposals = res.items;
        this.metadata = res.metadata;
      });
  }
  changePage(page: number): void {
    this.pageNumber = page;
    this.loadProposals();
  }

  getPageArray(): number[] {
    return Array(this.metadata?.totalPages || 0)
      .fill(0)
      .map((_, i) => i + 1);
  }
}
  