import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var jQuery:any;
declare var $:any;

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
  public desplegado:boolean;

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
    let token = sessionStorage.getItem('token');
    return token != null;
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  desplegar(){
      $(".desplegar-submenu").click(function(){
        $(this).children("ul").toggle();
      });
  }

}