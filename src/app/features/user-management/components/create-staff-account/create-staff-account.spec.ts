import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStaffAccountComponent } from './create-staff-account';

describe('CreateStaffAccount', () => {
  let component: CreateStaffAccountComponent;
  let fixture: ComponentFixture<CreateStaffAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStaffAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStaffAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
