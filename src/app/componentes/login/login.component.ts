import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../_service/login.service';
import { TOKEN_NAME, HIDE_NAV } from '../../_service/var.const';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as decode from 'jwt-decode';
import { UsersService } from '../../_service/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // credenciales del usuario
  identificacion: string;
  clave: string;
  estado: number;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
  }

  iniciarSesion() {

    this.spinnerService.show();

    // enviamos las credenciales al servidor
    this.loginService.login(this.identificacion, this.clave).subscribe(data => {

      let token: any = data;

      // almacenamos el token en la sesion
      sessionStorage.setItem(TOKEN_NAME, JSON.stringify(token));

      // obtenemos la identificacion del usuario
      let identificacion = decode(token.access_token).user_name;

      // verificamos si es un usuario nuevo o le acaban de restaurar la contraseña
      this.usersService.buscarNuevoPorIdentificacion(identificacion).subscribe(res => {

        this.spinnerService.hide();

        if (res) {

          /*
          * generamos un string aleatorio, solo nos interesa crear el item en el sesion
          * storage
          */
          let random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

          sessionStorage.setItem(HIDE_NAV, random);

          /*
          * lo enviamos a cambiar la contraseña con el nav bloquado para obligarlo a 
          * cambiar la contraseña
          */
          this.router.navigate(['cambiar-clave']);

        } else {
          this.router.navigate(['distribucion-agua-mensual']);
        }

      }, err => {
        this.spinnerService.hide();
        this.estado = 1;
      });

    }, err => {
      this.spinnerService.hide();
      this.estado = 2;
    });
  }

}
