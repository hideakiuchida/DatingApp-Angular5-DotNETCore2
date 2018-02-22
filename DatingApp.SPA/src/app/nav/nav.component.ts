import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private service: AuthenticationService) { }

  ngOnInit() {
  }

  login(){
    this.service.login(this.model).subscribe(
      data => {
      console.log('logged in successfully');
    }, error => {
      console.log('failed to login');
    });
  }

  logout(){
    this.service.userToken = null;
    localStorage.removeItem('token');
    console.log('logout');
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !!token;
  }

}
