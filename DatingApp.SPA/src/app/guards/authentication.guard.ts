import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AlertifyService } from '../services/alertify/alertify.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private alertify: AlertifyService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if  (this.authService.loggedIn()) {
       return true;
    }
    this.alertify.error('You are not logged in');
    this.router.navigate(['/home']);
  }
}
