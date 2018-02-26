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
    uniqueName: String;

    constructor(private authService: AuthenticationService, private alertify: AlertifyService, private router: Router) { }

    ngOnInit() {
    }

    login() {
      this.authService.login(this.model).subscribe(
        data => {
        this.alertify.success('logged in successfully');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.router.navigate(['/members']);
      });
    }

    logout() {
      this.authService.userToken = null;
      localStorage.removeItem('token');
      this.alertify.message('logout');
      this.router.navigate(['/home']);
    }

    loggedIn() {
      return this.authService.loggedIn();
    }

}
