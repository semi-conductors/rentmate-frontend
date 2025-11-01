import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDetailsComponent } from './delivery-details.component';

describe('DeliveryDetails', () => {
  let component: DeliveryDetailsComponent;
  let fixture: ComponentFixture<DeliveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
