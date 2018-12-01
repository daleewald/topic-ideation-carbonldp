import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TopicComponent } from './topic/topic.component';

import { TopicService } from './services/topic.service';

@NgModule({
  providers: [
    TopicService
  ],
  declarations: [
    AppComponent,
    TopicComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
