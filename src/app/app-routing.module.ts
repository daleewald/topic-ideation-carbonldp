import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicListComponent } from './topic-list/topic-list.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { ViewTopicComponent } from './view-topic/view-topic.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './auth/auth.guard';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'topics', component: TopicListComponent },
  { path: 'create-topic', component: CreateTopicComponent, canActivate: [AuthGuard] },
  { path: 'view-topic/:slug', component: ViewTopicComponent },
  { path: '', redirectTo: '/topics', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
