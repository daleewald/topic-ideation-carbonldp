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
    return isOwner || false;
  }

  likeIdeaToggle(ideaId: any): void {
    this.topicService.toggleIdeaLike(ideaId, this.authService.userParticipant).then(
      (idea: any) => {
        let index:any = null;
        for (let i in this.ideaList) {
            if (this.ideaList[i].$id === ideaId) {
              index = i;
              break;
            }
        }
        if (index != null) {
          this.ideaList[index] = idea;
          console.log('this.ideaList[index]', this.ideaList[index]);
        }
      }
    );
  }

  dislikeIdeaToggle(ideaId: any): void {
    console.log('toggle dislike', ideaId);
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
