import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationSummaryTable } from './verification-summary-table';

describe('VerificationSummaryTable', () => {
  let component: VerificationSummaryTable;
  let fixture: ComponentFixture<VerificationSummaryTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationSummaryTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationSummaryTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
