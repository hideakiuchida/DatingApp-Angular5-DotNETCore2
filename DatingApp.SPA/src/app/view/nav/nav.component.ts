import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AlertifyService } from '../../services/alertify/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    model: any = {};
    userName: String;
    photoUrl: String;

    constructor(private authService: AuthenticationService, private alertify: AlertifyService, private router: Router) { }

    ngOnInit() {
      this.setUser();
    }

    login() {
      this.authService.login(this.model).subscribe(
        data => {
        this.setUser();
        this.alertify.success('logged in successfully');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.router.navigate(['/members']);
      });
    }

    setUser() {
      this.userName = this.authService.decodedToken != null ? this.authService.decodedToken.unique_name : ' ';
      this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    }

    logout() {
      this.authService.userToken = null;
      this.authService.currentUser = null;
      this.authService.decodedToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.alertify.message('logout');
      this.router.navigate(['/home']);
    }

    loggedIn() {
      return this.authService.loggedIn();
    }

}
