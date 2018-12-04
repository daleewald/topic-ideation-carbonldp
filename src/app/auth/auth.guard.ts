import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log('AuthGuard#CanActivate called.');
      let url: string = state.url;

      return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    console.log("isLoggedIn: " + this.authService.isLoggedIn);
    if (this.authService.isLoggedIn) return true;

    this.authService.redirectUrl = url;

    this.router.navigate(['/account']);
    return false;
  }
}
