import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'ti-view-topic',
  templateUrl: './view-topic.component.html',
  styleUrls: ['./view-topic.component.css']
})
export class ViewTopicComponent implements OnInit {
  topic: any = {
    owner: {}
  };
  deleteTopicName = new FormControl('');
  deleteRequested: boolean = false;
  deleteConfirmed: boolean = false;
  messages: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private topicService: TopicService,
    private location: Location,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log('onInit view-topic');
    this.getTopic();
  }

  getTopic(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.topicService.getTopic(slug).then(
      (sTopic:any) => {
        console.log("getTopic", sTopic);
          this.topic = sTopic;
          this.topicService.topicSelected(sTopic);
      }
    ).catch( error => console.log(error) );
  }

  deleteTopic(dTopicName: string): void {
    if (!this.deleteRequested) {
      this.deleteRequested = true;
      return;
    } else {
      if (this.deleteTopicName.value === this.topic.name) {
        this.topicService.deleteTopic(this.topic).then(
          () => {
          this.deleteRequested = false;
          this.router.navigate(['/topics']);
          }
        ).catch( error => this.messages = error );
      }
    }

  }

  isParticipating(): boolean {
    let isOwner: boolean = this.topicService.selectedTopic.owner === this.authService.userParticipant;
    return isOwner || false;
  }

  isAllowedToDelete() {
    return this.authService.isLoggedIn && (this.topic.owner === this.authService.userParticipant);
  }

  stopDeleteTopic() {
    this.deleteRequested = false;
  }

  isDeleteRequested() {
    return this.deleteRequested;
  }

  navBack(): void {
    this.location.back();
  }

}
