import { Component, OnInit, Input } from '@angular/core';
import { Photo } from '../../../models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { UserService } from '../../../services/user/user.service';
import { AlertifyService } from '../../../services/alertify/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor(private authenticationService: AuthenticationService, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authenticationService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photoResponse: Photo = JSON.parse(response);
        const photo = {
          id: photoResponse.id,
          url: photoResponse.url,
          dateAdded: photoResponse.dateAdded,
          description: photoResponse.description,
          isMain: photoResponse.isMain
        };
        this.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authenticationService.decodedToken.nameid, photo.id).subscribe(() => {
      console.log('The photo has set correctly');
    }, error => {
      this.alertify.error(error);
    });
  }
}
