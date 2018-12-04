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
  participants: any = [];
  messages: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private topicService: TopicService,
    private location: Location,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getTopic();
  }

  getTopic(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.topicService.getTopic(slug).then(
      (sTopic:any) => {
          if (! sTopic.$isResolved()) sTopic.$resolve();
          this.topic = sTopic;
          this.participants = [];
          for (let participant in sTopic.participants) {
            this.participants.push(sTopic.participants[participant]);
          }
//          this.participants = sTopic.participants;
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

  isAuthenticated():boolean {
    return this.authService.isLoggedIn;
  }
  isAllowedToDelete() {
    console.log(this.topic);
    return this.isAuthenticated(); // && (this.topic.participants[0].$id === this.authService.userParticipant.$id);
  }

  isDeleteRequested() {
    return this.deleteRequested;
  }

  navBack(): void {
    this.location.back();
  }

}
