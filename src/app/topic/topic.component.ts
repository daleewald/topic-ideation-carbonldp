import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'ti-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {
  topicName = new FormControl('');
  output = '';
  isError = false;

  constructor(private topicService: TopicService) {}

  ngOnInit() {
  }

  createTopicInCarbonLDP() {
    this.topicService.createTopic(this.topicName.value).then(
        ( topicUri:string) => {
          this.isError = false;
          this.output = "Topic successfully created.";
      }).catch(
        error => {
          this.isError = true;
          this.output = error;
        }
      );
  }

  getMessageClass() {
    return {
      'message':true,
      'text-danger':this.isError,
      'text-success':!this.isError
    }
  }

}
