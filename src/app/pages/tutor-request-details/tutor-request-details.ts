import { Component, inject, OnInit } from '@angular/core';
import { STutorRequestDetails } from '../../core/services/TutorRequestDetails/stutor-request-details';
import { TutorRequest } from '../../shared/interfaces/tutor-request';
import { IProposal } from '../../shared/interfaces/iproposal';
import {
  Pagination,
  PaginationResult,
} from '../../shared/interfaces/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../core/services/auth/login/login-service';
import { UserDecodedToken } from '../../shared/interfaces/user-decoded-token';
import { InstructorService } from '../../core/services/instructor/instructor-service';
import { InstructorData } from '../../shared/interfaces/instructor-data';
import { ChatService } from '../../core/services/chat/chat-service';
import { error } from 'console';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProposalService } from '../../core/services/proposal/proposal-service';
import { SessionService } from '../../core/services/sessions/session-service';
import { ReviewService } from '../../core/services/review/reviewService';

@Component({
  selector: 'app-tutor-request-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tutor-request-details.html',
  styleUrl: './tutor-request-details.css',
})
export class TutorRequestDetails implements OnInit {
  id!: number;
  request: TutorRequest | null = null;
  proposals!: IProposal[];
  totalProposals: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  isVerified: boolean = false;
  isSubmitValid: boolean = true;

  metadata: Pagination = {
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
  };
  pageNumber = 1;
  userData!: UserDecodedToken;
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  _ProposalService = inject(ProposalService);
  _SessionService = inject(SessionService);
  reviewService = inject(ReviewService);

  instructorId!: string;
  instructorRating: number = 0;

  _instructorService = inject(InstructorService);
  _loginService = inject(LoginService);
  _ChatService = inject(ChatService);

  x = 'https://player.cloudinary.com/embed/?cloud_name=dxayhetog&public_id=';
  y = '&profile=cld-default';

  videoUrls: SafeResourceUrl[] = [];

  // Date selection properties
  selectedDates: { [proposalId: number]: string } = {};
  expandedProposals: { [proposalIndex: number]: boolean } = {};

  constructor(
    private tutorRequestService: STutorRequestDetails,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.userData = this._loginService.userData;

    this.tutorRequestService.getTutorRequest(this.id).subscribe({
      next: (data) => {
        this.request = data;
        this.loadProposals();
      },
      error: (err) => {
        console.error('Failed to load tutor request:', err);
      },
    });
    if (this.userData.role === 'Instructor') {
      this.CheckIfInstructorVerified();
      this._ProposalService
        .checkProposalAlreadyAdded(this.id, this.userData.nameid)
        .subscribe({
          next: (res) => {
            this.isSubmitValid = !res;
          },
        });
    }
  }

  getCeilValue(value: number): number {
    return Math.ceil(value);
  }
  CheckIfInstructorVerified() {
    this._instructorService
      .getInstructorIsVerified(this.userData.nameid)
      .subscribe({
        next: (isVerified) => {
          this.isVerified = isVerified;
        },
        error: (err) => {
          console.error('Error fetching isVerified:', err);
        },
      });
  }

  getInstructorByProposalID(id: number) {
    this._instructorService.getInstructorByProposalID(id).subscribe({
      next: (data: InstructorData) => {
        this.instructorId = data.id;
        this.instructorRating = data.rating;

        this._ChatService
          .createChat({
            userId1: this.userData.nameid,
            userId2: this.instructorId,
          })
          .subscribe({
            next: (res) => {
              console.log('Chat created:', res);
              this.router.navigate([`/my-chat/${this.userData.nameid}`]);
            },
            error: (err) => {
              if (err.error == 'Chat already exists or failed to create.') {
                this._ChatService
                  .getChatBetween(this.userData.nameid, this.instructorId)
                  .subscribe({
                    next: (res) => {
                      console.log('Chat found:', res);
                      this.router.navigate([
                        `/my-chat/${this.userData.nameid}`,
                      ]);
                    },
                    error: (err) => {
                      console.error('Failed to find chat:', err);
                    },
                  });
              }
            },
          });
      },
      error: (err) => {
        console.error('Failed to load instructor:', err);
      },
    });
  }

  loadProposals(): void {
    this.tutorRequestService
      .getProposals(this.id, this.pageNumber, this.pageSize)
      .subscribe((res) => {
        this.proposals = res.items;

        // تأمين روابط الفيديو
        this.videoUrls = this.proposals.map((proposal) =>
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `${this.x}${proposal.publicId}${this.y}`
          )
        );

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

  // Date selection methods
  toggleDateSelection(proposalIndex: number): void {
    this.expandedProposals[proposalIndex] =
      !this.expandedProposals[proposalIndex];
  }

  selectDate(proposalId: number, date: string): void {
    this.selectedDates[proposalId] = date;
    this.expandedProposals[proposalId] = false;
  }

  isDateSelected(proposalId: number): boolean {
    return !!this.selectedDates[proposalId];
  }

  getSelectedDate(proposalId: number): string {
    return this.selectedDates[proposalId] || '';
  }

  acceptProposal(proposal: IProposal): void {
    const selectedDate = this.selectedDates[proposal.id];
    if (!selectedDate) {
      alert('Please select a date before accepting the proposal.');
      return;
    }

    console.log('Accepted Proposal:', {
      proposalId: proposal.id,
      tutorRequestId: this.id,
      instructorName: proposal.instructorDisplayName,
      selectedDate,
      priceOffered: proposal.priceOffered,
    });

    this._ProposalService.changeProposalStatus(proposal.id, 2).subscribe({
      next: (res) => {
        console.log('Proposal accepted:', res);
      },
      error: (err) => {
        console.error('Failed to accept proposal:', err);
      },
    });

    this._SessionService.createSession(this.id, selectedDate).subscribe({
      next: (res) => {
        console.log('Session created:', res);
        this.router.navigate([`/meeting/${res}`]);
      },
      error: (err) => {
        console.error('Failed to create session:', err);
      },
    });

    // API call here
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
