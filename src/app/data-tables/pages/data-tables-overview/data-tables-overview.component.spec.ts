import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTablesOverviewComponent } from './data-tables-overview.component';

describe('DataTablesOverviewComponent', () => {
  let component: DataTablesOverviewComponent;
  let fixture: ComponentFixture<DataTablesOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTablesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTablesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
