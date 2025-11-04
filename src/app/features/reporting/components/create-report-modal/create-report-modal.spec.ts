import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportModal } from './create-report-modal';

describe('CreateReportModal', () => {
  let component: CreateReportModal;
  let fixture: ComponentFixture<CreateReportModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReportModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReportModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
