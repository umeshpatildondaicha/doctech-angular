import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPrescriptionComponent } from './print-prescription.component';

describe('PrintPrescriptionComponent', () => {
  let component: PrintPrescriptionComponent;
  let fixture: ComponentFixture<PrintPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintPrescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
