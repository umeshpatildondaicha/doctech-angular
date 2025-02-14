import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandChartCellComponent } from './expand-chart-cell.component';

describe('ExpandChartCellComponent', () => {
  let component: ExpandChartCellComponent;
  let fixture: ComponentFixture<ExpandChartCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandChartCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandChartCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
