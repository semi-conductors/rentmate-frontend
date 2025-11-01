import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCardComponent } from './delivery-card.component';

describe('DeliveryCard', () => {
  let component: DeliveryCardComponent;
  let fixture: ComponentFixture<DeliveryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
