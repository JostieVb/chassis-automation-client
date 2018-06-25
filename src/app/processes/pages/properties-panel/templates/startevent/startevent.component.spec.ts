import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarteventComponent } from './startevent.component';

describe('StarteventComponent', () => {
  let component: StarteventComponent;
  let fixture: ComponentFixture<StarteventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarteventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarteventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
