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
  localRole = signal<string | null>(null);
  localStatus = signal<string | null>(null);
  reason = signal<string | null>(null);

  ngOnInit(): void {
    this.localRole.set(this.currentRole?.()??null);
    this.localStatus.set(this.currentStatus?.()??null);
    this.reason.set(this.currentReason?.()??null);
  }

  onConfirm() {
    this.save.emit({ role: this.localRole()??'', status: this.localStatus()??'', reason: this.reason() ?? undefined });
  }
  onCancel() {
    this.cancel.emit();
  }

  onRoleChange(eventTarget: EventTarget | null) {
    const value = (eventTarget as HTMLSelectElement).value;
    this.localRole.set(value);
  }
  onStatusChange(eventTarget: EventTarget | null) {
    const value = (eventTarget as HTMLSelectElement).value;
    this.localStatus.set(value);
  }
  onReasonChange(eventTarget: EventTarget | null) {
    const value = (eventTarget as HTMLTextAreaElement).value;
    this.reason.set(value);
  }
}