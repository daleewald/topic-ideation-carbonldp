import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'ti-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {
  output: any = '';

  constructor(private topicService: TopicService) {}

  ngOnInit() {
  }

  createTopicInCarbonLDP() {
    this.topicService.createTopic();
  }

}
