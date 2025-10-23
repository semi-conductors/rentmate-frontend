import { Component, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-status-modal.html'
})
export class UserStatusModalComponent implements OnInit {
  // parent passes current values
  currentRole = input<string | null>();
  currentStatus = input<string | null>();
  currentReason = input<string | null>();

  // outputs
  save = output<{ role: string; status: string; reason?: string }>();
  cancel = output<void>();

  // local editable signals
  localRole = signal<string | null>(this.currentRole?.()??null);
  localStatus = signal<string | null>(this.currentStatus?.()??null);
  reason = signal<string | null>(this.currentReason?.()??null);

  ngOnInit(): void {
    this.localRole = signal<string | null>(this.currentRole?.()??null);
    this.localStatus = signal<string | null>(this.currentStatus?.()??null);
    this.reason = signal<string | null>(this.currentReason?.()??null);
  }
  onConfirm() {
    this.save.emit({ role: this.localRole()??'', status: this.localStatus()??'', reason: this.reason() ?? undefined });
  }
  onCancel() {
    this.cancel.emit();
  }
}