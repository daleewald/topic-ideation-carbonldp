import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { AuthService } from '../services/auth.service';

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
    private router: Router,
    private topicService: TopicService,
    private location: Location,
    private authService: AuthService
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
    let userParticipant = this.authService.userParticipant;

    this.topicService.createTopic(this.topicName.value, userParticipant, [userParticipant]).then(
        ( topic:any) => {
          console.log('createTopic resolved');
          this.isError = false;
          this.topicName.reset();
          this.showUriToBe('');
          this.output = "Topic successfully created.";
          this.router.navigate(["/view-topic/" + topic.$slug ])
      }).catch(
        error => {
          console.log('createTopic error');
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
