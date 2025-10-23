import { Component, output, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-logout-confirm-modal',
  templateUrl: './logout-confirm-modal.html',
})
export class LogoutConfirmModalComponent {
  confirm = output<void>();
  cancel = output<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}