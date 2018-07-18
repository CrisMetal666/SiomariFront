import { Component, OnInit } from '@angular/core';
import { HeaderToken } from '../../_service/header-token';
import * as decode from 'jwt-decode';
import { UsersService } from '../../_service/users.service';
import { Users } from '../../_model/users';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit {

  // objeto necesario para acceder al token y obtener el usuario
  private token: HeaderToken;
  clave: string;
  clave2: string;
  // true si las contraseñas no coinciden
  incorrecto: boolean;
  // dependiendo del valor numerico se mostrara un mensaje al usuario
  estado: number;

  constructor(
    private usersService: UsersService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.token = new HeaderToken();
    this.incorrecto = false;
    this.clave = '';
    this.clave2 = '';
  }

  ngOnInit() {

  }

  /*
   * logica para determinar si las contraseñas coinciden o no, mostrar mensakje usuario 
   * y bloquear formulario
   */
  coinciden() {

    if ((this.clave.length == 0 && this.clave2.length != 0) ||
      (this.clave.length != 0 && this.clave2.length == 0) ||
      (this.clave.length == 0 && this.clave2.length == 0)) {

      this.incorrecto = false;
      return
    }

    if (this.clave != this.clave2) {

      this.incorrecto = true;

    } else {

      this.incorrecto = false;

    }
  }

  guardar(form) {

    this.spinnerService.show();

    // llenamos el objeto con el usuario y la contraseña nueva
    let identificacion: string = decode(this.token.getToken()).user_name;
    let user: Users = new Users();

    user.identificacion = identificacion;
    user.clave = this.clave;

    this.usersService.cambiarClave(user).subscribe(res => {

      this.estado = 1;
      this.clave = '';
      this.clave2 = '';
      form.reset();

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

}
