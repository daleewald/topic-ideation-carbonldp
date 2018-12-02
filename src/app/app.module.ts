import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TopicComponent } from './topic/topic.component';

import { TopicService } from './services/topic.service';
import { TopicListComponent } from './topic-list/topic-list.component';

@NgModule({
  providers: [
    TopicService
  ],
  declarations: [
    AppComponent,
    TopicComponent,
    TopicListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
