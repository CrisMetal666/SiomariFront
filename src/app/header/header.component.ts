import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_NAME, HIDE_NAV } from '../_service/var.const';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  /**
   * mostrara los sub-menus
   * 0 - Mostrara el menu principal
   * 1 - Planeación
   * 2 - Registro
   * 3 - Estructura operacional
   * 4 - Hidrometría
   * 5 - Programación
   * 6 - Distribución
   * 7 - Entregas
   * 8 - Reportes
   * 9 - Evaluación
   * 10 - cuenta
   */
  public seleccionado: number;

  constructor(
    private router: Router
  ) { 
    this.seleccionado = 0;
  }

  ngOnInit() {
  }

  cambiarNav(seleccion: number) {
    this.seleccionado = seleccion;
  }

  isAuthenticated() {
    // verificamos si se ha logiado
    let token = sessionStorage.getItem(TOKEN_NAME);
    // verificamos si el usuario es nuevo o tiene la contraseña restaurada
    let isNuevo = sessionStorage.getItem(HIDE_NAV);

    return token != null && isNuevo == null;
  }

  cerrarSesion() {    
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
