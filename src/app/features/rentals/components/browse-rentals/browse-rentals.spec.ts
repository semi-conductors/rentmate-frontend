import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseRentals } from './browse-rentals';

describe('BrowseRentals', () => {
  let component: BrowseRentals;
  let fixture: ComponentFixture<BrowseRentals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseRentals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseRentals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
