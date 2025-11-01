import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationQueue } from './verification-queue';

describe('VerificationQueue', () => {
  let component: VerificationQueue;
  let fixture: ComponentFixture<VerificationQueue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationQueue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationQueue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
