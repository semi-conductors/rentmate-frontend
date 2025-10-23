import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutConfirmModal } from './logout-confirm-modal';

describe('LogoutConfirmModal', () => {
  let component: LogoutConfirmModal;
  let fixture: ComponentFixture<LogoutConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutConfirmModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutConfirmModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
