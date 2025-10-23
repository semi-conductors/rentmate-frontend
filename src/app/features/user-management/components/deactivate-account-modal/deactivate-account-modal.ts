import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deactivate-account-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deactivate-account-modal.html',
})
export class DeactivateAccountModalComponent {
  // ⬇️ Input signal from parent to show loading spinner or disable buttons
  loading = input(false);

  // ⬆️ Output signals (replaces EventEmitter)
  confirm = output<void>();
  cancel = output<void>();

  // Internal input text signal
  inputText = signal('');

  get disabled() {
    return this.inputText().trim() !== 'DEACTIVATE' || this.loading();
  }

  onConfirm() {
    if (!this.disabled) this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
  
  onTextChange(value: string) {
    this.inputText.set(value);
  }
}