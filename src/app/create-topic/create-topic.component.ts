import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'ti-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.css']
})
export class CreateTopicComponent implements OnInit {
  topicName = new FormControl('');
  output = '';
  isError = false;
  uriToBe = '';

  constructor(
    private topicService: TopicService,
    private location: Location
  ) {
    this.showUriToBe('');
  }

  ngOnInit() {
  }

  navBack(): void {
    this.location.back();
  }

  showUriToBe(value: string) {
    let svc = this.topicService;

    this.uriToBe = svc.carbonUri + '/' + svc.topicsRoot + svc.makeFriendlySlug(value);
  }

  createTopicInCarbonLDP() {
    this.topicService.createTopic(this.topicName.value).then(
        ( topicUri:string) => {
          this.isError = false;
          this.topicName.reset();
          this.showUriToBe('');
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
