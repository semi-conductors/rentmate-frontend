import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDashboardComponent } from './report-dashboard';

describe('ReportDashboard', () => {
  let component: ReportDashboardComponent;
  let fixture: ComponentFixture<ReportDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
