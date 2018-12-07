import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';

import { TopicService } from './services/topic.service';
import { AuthService } from './services/auth.service';
import { TopicListComponent } from './topic-list/topic-list.component';
import { AppRoutingModule } from './app-routing.module';
import { ViewTopicComponent } from './view-topic/view-topic.component';
import { AccountComponent } from './account/account.component';
import { LogoutComponent } from './logout/logout.component';
import { TopicIdeaListComponent } from './topic-idea-list/topic-idea-list.component';
import { AddEditIdeaComponent } from './add-edit-idea/add-edit-idea.component';

@NgModule({
  providers: [
    TopicService,
    AuthService
  ],
  declarations: [
    AppComponent,
    CreateTopicComponent,
    TopicListComponent,
    ViewTopicComponent,
    AccountComponent,
    LogoutComponent,
    TopicIdeaListComponent,
    AddEditIdeaComponent
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
