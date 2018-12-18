import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ti-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}
  title = 'Topic Ideation';
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
}
