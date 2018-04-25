import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProcessModalComponent } from './new-process.modal';

describe('NewProcessComponent', () => {
  let component: NewProcessModalComponent;
  let fixture: ComponentFixture<NewProcessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProcessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProcessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
