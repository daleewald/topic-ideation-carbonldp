import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';

import { TopicService } from './services/topic.service';
import { TopicListComponent } from './topic-list/topic-list.component';
import { AppRoutingModule } from './app-routing.module';
import { ViewTopicComponent } from './view-topic/view-topic.component';

@NgModule({
  providers: [
    TopicService
  ],
  declarations: [
    AppComponent,
    CreateTopicComponent,
    TopicListComponent,
    ViewTopicComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
