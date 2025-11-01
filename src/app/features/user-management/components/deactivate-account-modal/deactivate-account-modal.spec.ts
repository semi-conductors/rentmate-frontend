import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateAccountModalComponent } from './deactivate-account-modal';

describe('DeactivateAccountModal', () => {
  let component: DeactivateAccountModalComponent;
  let fixture: ComponentFixture<DeactivateAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateAccountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
