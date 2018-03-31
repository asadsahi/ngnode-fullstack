import { Component, OnInit } from '@angular/core';

import { DataService, AuthService } from '@app/core';
import { NotificationsService } from '@app/core';

@Component({
  selector: 'appc-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.scss']
})
export class UserPhotoComponent implements OnInit {
  profilePicture: any = '';
  selectedImage: any;
  filesToUpload: Array<File> = [];

  constructor(private dataService: DataService, private authService: AuthService, private ns: NotificationsService) { }

  ngOnInit() {
    const url = `${this.authService.user().profileImage}`;
    if (url && 'undefined' !== url) {
      this.dataService.getImage(url).subscribe(pic => {
        this.profilePicture = pic;
      });
    }
  }

  fileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileName = event.target.files[0].name;
      console.log(fileName);
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedImage = {
          mimetype: e.target.result.split(',')[0].split(':')[1].split(';')[0],
          url: e.target.result
        };
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  upload() {
    this.dataService.post('api/users/picture', this.selectedImage)
      .subscribe(image => {
        this.selectedImage = null;
        this.ns.success('Success', 'Image changed successfully');

      });
  }

  cancel() {
    this.selectedImage = undefined;
  }
}
