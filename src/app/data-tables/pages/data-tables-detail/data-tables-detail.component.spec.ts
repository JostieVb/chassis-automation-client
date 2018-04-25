import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTablesDetailComponent } from './data-tables-detail.component';

describe('DataTablesDetailComponent', () => {
  let component: DataTablesDetailComponent;
  let fixture: ComponentFixture<DataTablesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTablesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTablesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
