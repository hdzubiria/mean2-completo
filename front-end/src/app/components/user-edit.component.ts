import { Component, OnInit } from '@angular/core';

import { GLOBAL} from '../services/global';
import { UserService } from '../services/user.service';
import { User } from '../models/user';


@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService]
})

export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public alertMessage: string;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(private _userService:UserService) {
    this.title = 'Actualizar Mis Datos';
    this.url = GLOBAL.url;
    // LocalStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
  }

  /**
   * onSubmitRegister
   */
  public onSubmit() {
    this._userService.UpdateUser(this.user)
    .subscribe(
      user=>{
        const userUpdated: User = user;
        if (!userUpdated._id) {
          this.alertMessage = 'NO fue posible Actualizar el Usuario';
        } else {
          document.getElementById('identity_name').innerHTML = this.user.name;
          // Cargar Imagen si se ha seleccionado
          if (this.filesToUpload) {
            this.makeFileRequest(`${this.url}upload-image-user/${this.user._id}`,[],this.filesToUpload)
            .then((result)=>{
              this.user.image = (result as any).image;
              const imagePath = this.url + 'get-image-user/' + this.user.image;
              document.getElementById('identity_image').setAttribute('src',imagePath); 
            })
          }
          localStorage.setItem('identity',JSON.stringify(this.user));
          this.alertMessage = `Usuario Actualizado.`;
        }
      },
      erroresponse => {
          this.alertMessage = erroresponse.error.message;
      }
    );
  }

  /**
   * fileChangeEvent
   */
  public fileChangeEvent(fileInput: any) {
    this.filesToUpload = fileInput.target.files as Array<File>;
  }

  /**
   * makeFileRequest
   */
  public makeFileRequest(url: string, parmas: Array<string>, files: Array<File>) {
    let token = this.token;

    return new Promise((resolve, reject) => {

      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response))
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    })
  }
}
