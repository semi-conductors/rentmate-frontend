import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationManagement } from './verification-management';

describe('VerificationManagement', () => {
  let component: VerificationManagement;
  let fixture: ComponentFixture<VerificationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
