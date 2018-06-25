import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceflowComponent } from './sequenceflow.component';

describe('SequenceflowComponent', () => {
  let component: SequenceflowComponent;
  let fixture: ComponentFixture<SequenceflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequenceflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
