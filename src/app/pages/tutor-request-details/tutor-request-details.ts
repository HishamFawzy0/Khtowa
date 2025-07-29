import {  Component, inject, OnInit } from '@angular/core';
import { STutorRequestDetails } from '../../core/services/TutorRequestDetails/stutor-request-details';
import { TutorRequest } from '../../shared/interfaces/tutor-request';
import { IProposal ,Metadata} from '../../shared/interfaces/iproposal';
import { PaginationResult } from '../../shared/interfaces/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tutor-request-details',
  imports: [CommonModule, FormsModule],
templateUrl: './tutor-request-details.html',
  styleUrl: './tutor-request-details.css'
})
export class TutorRequestDetails implements OnInit {
  id!: number;
  request: TutorRequest | null = null;
  proposals: IProposal[] = [];
  totalProposals: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  metadata!: Metadata;
  pageNumber = 1;

  constructor(private tutorRequestService: STutorRequestDetails ,private route: ActivatedRoute) {}

  ngOnInit()  : void{

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.tutorRequestService.getTutorRequest(this.id).subscribe(
      data => {
        this.request = data;
      },
      error => {
        console.error('Failed to load tutor request:', error);
      }
    );
      this.loadProposals();
  }
  loadProposals(): void {
    this.tutorRequestService.getProposals(this.id, this.pageNumber, this.pageSize).subscribe((res) => {
        this.proposals = res.items;
        this.metadata = res.metadata;
      });  
    }
  changePage(page: number): void {
    this.pageNumber = page;
    this.loadProposals();
  }

  getPageArray(): number[] {
    return Array(this.metadata?.totalPages || 0).fill(0).map((_, i) => i + 1);
  }
  }
  