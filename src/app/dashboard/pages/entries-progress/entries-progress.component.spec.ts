import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesProgressComponent } from './entries-progress.component';

describe('EntriesProgressComponent', () => {
  let component: EntriesProgressComponent;
  let fixture: ComponentFixture<EntriesProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntriesProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
