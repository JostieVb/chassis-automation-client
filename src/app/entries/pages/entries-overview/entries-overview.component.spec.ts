import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesOverviewComponent } from './entries-overview.component';

describe('EntriesOverviewComponent', () => {
  let component: EntriesOverviewComponent;
  let fixture: ComponentFixture<EntriesOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntriesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
