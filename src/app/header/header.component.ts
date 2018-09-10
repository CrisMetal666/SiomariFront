import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderToken } from '../_service/header-token';
import { TOKEN_NAME, ROLE_JEFE_DISTRITO, ROLE_JEFE_OPERACION, HIDE_NAV } from '../_service/var.const';
declare var $: any;
import { tokenNotExpired } from 'angular2-jwt';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  headerToken: HeaderToken;
  role: string;
  /*
  * inicializaremos los posibles roles que tiene el sistema para hacer las condiciones 
  * con la directiva if y evitar codigo quemado y en un futuro sea mas flexible cambiar 
  * la parte de roles con mayor facilidad
  */
  role_jefe_operacion: string;
  role_jefe_distrito: string;

  constructor(
    private router: Router
  ) {
    this.headerToken = new HeaderToken();
    this.role_jefe_distrito = ROLE_JEFE_DISTRITO;
    this.role_jefe_operacion = ROLE_JEFE_OPERACION;
    this.role = "";
  }

  ngOnInit() {
  }

  isAuthenticated() {

    let token = this.headerToken.getToken();

    if (tokenNotExpired(TOKEN_NAME, token)) {

      let credenciales = decode(token);

      this.role = credenciales.authorities[0];

      let isNew = sessionStorage.getItem(HIDE_NAV);

      return true && isNew == null;

    } else {

      return false;
    }
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  goToHome() {
    this.router.navigate(['inicio']);
  }

}