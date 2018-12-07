import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'ti-topic-idea-list',
  templateUrl: './topic-idea-list.component.html',
  styleUrls: ['./topic-idea-list.component.css']
})
export class TopicIdeaListComponent implements OnInit {
  ideaList: any[] = [];

  constructor(
    private topicService: TopicService,
    private authService: AuthService
  ) {
    topicService.ideaAdded$.subscribe(
      idea => {
        this.ideaList.push(idea);
      }
    );
    topicService.topicSelected$.subscribe(
      topic => {
        this.getTopicIdeaListFromService();
      }
    )
  }

  ngOnInit() {

  }

  getTopicIdeaListFromService() {
    this.topicService.listSelectedTopicIdeas().then(
      (selectedTopicIdeaList:any) => {
          this.ideaList = selectedTopicIdeaList;
      }
    ).catch( error => { console.error(error); } );
  }

  getSortedIdeaList() {
    let ideaListForSort: any[] = this.ideaList.slice(0);
    ideaListForSort.sort((a,b):number => {
      return a.created - b.created;
    });
    return ideaListForSort;
  }

}
