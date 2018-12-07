import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'ti-add-edit-idea',
  templateUrl: './add-edit-idea.component.html',
  styleUrls: ['./add-edit-idea.component.css']
})
export class AddEditIdeaComponent implements OnInit {
  description: FormControl = new FormControl('');

  constructor(private topicService: TopicService) { }

  ngOnInit() {
  }

  ideaSubmit(): void {
    this.topicService.createTopicIdea(this.topicService.selectedTopic.$slug, this.description.value)
    .then(() => this.description.reset() );
  }

}
