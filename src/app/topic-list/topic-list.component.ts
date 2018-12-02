import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'ti-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {
  topicList = [];

  constructor(private topicService: TopicService) {
    this.getTopicListFromService();
    topicService.topicAdded$.subscribe(
      topic => {
        this.topicList.push(topic);
      }
    );
  }

  getTopicListFromService() {
    this.topicService.listTopicDocuments().then(
      (sTopicList:any) => {
          this.topicList = sTopicList;
      }
    ).catch( error => { console.error(error); } );
  }

  ngOnInit() {
  }

}
