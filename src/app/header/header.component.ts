import { Component, OnInit } from '@angular/core';

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
   */
  public seleccionado: number;

  constructor() { 
    this.seleccionado = 0;
  }

  ngOnInit() {
  }

  cambiarNav(seleccion: number) {
    this.seleccionado = seleccion;
  }

}
