import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditIdeaComponent } from './add-edit-idea.component';

describe('AddEditIdeaComponent', () => {
  let component: AddEditIdeaComponent;
  let fixture: ComponentFixture<AddEditIdeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditIdeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
