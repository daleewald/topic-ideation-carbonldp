import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ti-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}
  title = 'topic-ideation';

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn;
  }
  isNotAuthenticated(): boolean {
    return (this.authService.isLoggedIn === false);
  }
}
