import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditElementPropertiesComponent } from './edit-element-properties.component';

describe('EditElementPropertiesComponent', () => {
  let component: EditElementPropertiesComponent;
  let fixture: ComponentFixture<EditElementPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditElementPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditElementPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
