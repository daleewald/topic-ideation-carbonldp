import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ti-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {
  topicList = [];

  noTopics() {
    return this.topicList.length === 0;
  }

  constructor(private topicService: TopicService) {
    this.getTopicListFromService();
    topicService.topicAdded$.subscribe(
      topic => {
        this.topicList.push(topic);
      }
    );
  }

  ngOnInit() {
  }

  getSortedTopicList():any[] {
    let topicListForSort: any[] = this.topicList.slice(0);
    topicListForSort.sort((a,b):number => {
      return a.name.localeCompare(b.name);
    });
    return topicListForSort;
  }

  getTopicListFromService() {
    this.topicService.listTopicDocuments().then(
      (sTopicList:any) => {
          this.topicList = sTopicList;
      }
    ).catch( error => { console.error(error); } );
  }

}
