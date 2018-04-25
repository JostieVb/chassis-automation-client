import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsAddComponent } from './forms-add.component';

describe('FormsAddComponent', () => {
  let component: FormsAddComponent;
  let fixture: ComponentFixture<FormsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
