import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioNinoComponent } from './calendario-nino.component';

describe('CalendarioNinoComponent', () => {
  let component: CalendarioNinoComponent;
  let fixture: ComponentFixture<CalendarioNinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioNinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioNinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
