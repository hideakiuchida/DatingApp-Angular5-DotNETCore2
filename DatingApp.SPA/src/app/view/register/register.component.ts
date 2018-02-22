import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter();

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  register(){
    console.log('has entedered');
    this.authenticationService.register(this.model).subscribe(() => {
      console.log('Registration successful');
    }, error =>{ 
      console.log(error);
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }

}
