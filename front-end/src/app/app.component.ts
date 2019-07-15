import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { cleanSession } from 'selenium-webdriver/safari';
import { Token } from '@angular/compiler';

import { GLOBAL } from './services/global';
import { UserService } from './services/user.service';
import { User } from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {

  public title = 'Musify';
  public user: User;
  public errorMessage: string;
  public usertoRegister: User;
  public alertNewUserRegistered: string;
  public identity;
  public token;
  public url: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.url = GLOBAL.url;
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.usertoRegister = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  /**
   * ngOnInit()
   */
  public ngOnInit() {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  /**
   * onSubmit()
   */
  public onSubmitLogin() {
    this.userService.Signup(this.user)
      .subscribe(
        user => {
          this.identity = user;
          if (!this.identity._id) {
            alert('Usuario NO Logueado Correctamente!!!');
          } else {
            // Crear elemento en el localStorage
            localStorage.setItem('identity', JSON.stringify(this.identity));
            // Obtener el Token para Cada peticion HTTP
            this.userService.GetHash(this.user)
              .subscribe(
                response => {
                  this.token = (response as any).token;
                  if ((this.token.length < 1)) {
                    alert('Token Incorrecto!!!');
                  } else {
                    // Almacenar el LocalStorage para Usuario de sesion
                    localStorage.setItem('token', this.token);
                    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                  }
                },
                erroresponse => {
                      this.errorMessage = erroresponse.error.message;
                }
              );
          }
        },
        erroresponse => {
            this.errorMessage = erroresponse.error.message;
        }
      );
  }

  /**
   * onSubmitRegister
   */
  public onSubmitRegister() {
    this.userService.Register(this.usertoRegister)
    .subscribe(
      user => {
        const userStored: User = user;
        if (!userStored._id) {
          this.alertNewUserRegistered = 'NO fue posible Registar el Usuario';
        } else {
          this.alertNewUserRegistered = `Nuevo usuario Creado Exitosamente, Identificate con ${this.usertoRegister.email}`;
          this.usertoRegister = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      erroresponse => {
          this.alertNewUserRegistered = erroresponse.error.message;
      }
    );
  }

  /**
   * logout
   */
  public logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.router.navigate(['/']);
  }

}
