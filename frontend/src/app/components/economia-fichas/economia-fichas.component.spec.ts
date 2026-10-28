import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomiaFichasComponent } from './economia-fichas.component';

describe('EconomiaFichasComponent', () => {
  let component: EconomiaFichasComponent;
  let fixture: ComponentFixture<EconomiaFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomiaFichasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomiaFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
