import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicComponent } from './topic/topic.component';

const routes: Routes = [
  { path: 'topics', component: TopicListComponent },
  { path: 'create-topic', component: TopicComponent },
  { path: '', redirectTo: '/topics', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
