import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'ti-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) { }

  loginEmail: string;
  private loginPassphrase: string;
  loginMessages: string = '';

  firstName: string;
  lastName: string;
  email: string;
  private passphrase: string;
  accountMessages: string = '';

  ngOnInit() {
    if (this.isLoggedIn()) {
      let userParticipant = this.authService.userParticipant;
      this.firstName = userParticipant.firstName;
      this.lastName = userParticipant.lastName;
      this.email = userParticipant.email;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  hasLoginMessages(): boolean {
    return this.loginMessages != '';
  }

  hasAccountMessages(): boolean {
    return this.accountMessages != '';
  }

  loginSubmit(): void {
    this.authService.login(this.loginEmail, this.loginPassphrase).then(
      () => {
        let userParticipant = this.authService.userParticipant;
        this.firstName = userParticipant.firstName;
        this.lastName = userParticipant.lastName;
        this.email = userParticipant.email;
        if (this.authService.redirectUrl === '') {
          this.router.navigate(["topics/"]);
        } else {
          this.router.navigate([this.authService.redirectUrl]);
        }
      }
    ).catch( error => {
      this.loginMessages = error;
    });
  }

  newAccountSubmit(): void {
    this.authService.createAccount(this.firstName, this.lastName, this.email, this.passphrase).then(
      () => {
        if (this.authService.redirectUrl === '') {
          this.router.navigate(["topics/"]);
        } else {
          this.router.navigate([this.authService.redirectUrl]);
        }
      }
    ).catch( error => {
      this.accountMessages = error;
    })
  }

  navBack(): void {
    this.router.navigate(['/topics']);
  }
}
