import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../../services/alertify/alertify.service';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  @ViewChild('editForm') editForm: NgForm;
  photoUrl: string;

  constructor(private route: ActivatedRoute,
    private alertity: AlertifyService,
    private authService: AuthenticationService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user)
      .subscribe(next =>  {
        this.alertity.success('Profile Updated Succesfully');
        this.editForm.reset(this.user);
      }, error => {
        this.alertity.error(error);
      });
  }

  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }
}
