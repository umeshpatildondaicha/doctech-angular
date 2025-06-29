import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDashboardComponent } from './exercise-dashboard.component';

describe('ExerciseDashboardComponent', () => {
  let component: ExerciseDashboardComponent;
  let fixture: ComponentFixture<ExerciseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
