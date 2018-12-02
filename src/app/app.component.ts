import { Component } from '@angular/core';
import { TopicService } from './services/topic.service';

@Component({
  selector: 'ti-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'topic-ideation';
}
