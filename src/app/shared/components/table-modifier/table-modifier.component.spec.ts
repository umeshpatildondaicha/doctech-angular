import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableModifierComponent } from './table-modifier.component';

describe('TableModifierComponent', () => {
  let component: TableModifierComponent;
  let fixture: ComponentFixture<TableModifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableModifierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
