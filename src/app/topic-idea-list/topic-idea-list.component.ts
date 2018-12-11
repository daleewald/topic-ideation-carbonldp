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

  isParticipating(): boolean {
    let isOwner: boolean = this.topicService.selectedTopic.owner === this.authService.userParticipant;
    let isParticipant: boolean = (this.topicService.selectedTopic.participants.indexOf(this.authService.userParticipant) > -1);
    return isOwner || isParticipant;
  }

  participantLikesIdea(idea: any): boolean {
    if (Object.keys(idea).indexOf("likedBy") > -1) {
      return idea.likedBy.indexOf(this.authService.userParticipant) > -1;
    }
    return false;
  }

  participantDislikesIdea(idea: any): boolean {
    if (Object.keys(idea).indexOf("dislikedBy") > -1) {
      return idea.dislikedBy.indexOf(this.authService.userParticipant) > -1;
    }
    return false;
  }

  likeIdeaToggle(idea: any): void {
    this.topicService.toggleIdeaLikedBy(idea, this.authService.userParticipant);
  }

  dislikeIdeaToggle(idea: any): void {
    this.topicService.toggleIdeaDislikedBy(idea, this.authService.userParticipant);
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
