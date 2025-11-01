import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationRequest } from './verification-request';

describe('VerificationRequest', () => {
  let component: VerificationRequest;
  let fixture: ComponentFixture<VerificationRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
