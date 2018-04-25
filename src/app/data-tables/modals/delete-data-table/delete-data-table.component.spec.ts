import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDataTableComponent } from './delete-data-table.component';

describe('DeleteDataTableComponent', () => {
  let component: DeleteDataTableComponent;
  let fixture: ComponentFixture<DeleteDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
