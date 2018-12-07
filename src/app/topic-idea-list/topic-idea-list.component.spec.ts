import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicIdeaListComponent } from './topic-idea-list.component';

describe('TopicIdeaListComponent', () => {
  let component: TopicIdeaListComponent;
  let fixture: ComponentFixture<TopicIdeaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicIdeaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicIdeaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
