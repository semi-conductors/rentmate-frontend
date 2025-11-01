import { Component, input } from '@angular/core';
import { VerificationResponse } from '../../models/verification.response';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-verification-summary-table',
  imports: [DatePipe],
  templateUrl: './verification-summary-table.html',
  styleUrl: './verification-summary-table.css'
})
export class VerificationSummaryTableComponent {
  verifications = input<VerificationResponse[]>([]);
}