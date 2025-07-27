import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSelectboxComponent } from './app-selectbox.component';

describe('AppSelectboxComponent', () => {
  let component: AppSelectboxComponent;
  let fixture: ComponentFixture<AppSelectboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSelectboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppSelectboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
