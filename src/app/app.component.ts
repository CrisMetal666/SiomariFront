import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // mostrara u ocultara el submenu
  mostrar: boolean;
  /*
  * determinara que submenu ha sido seleccionado
  * 1 = Registro
  * 2 = Estroper
  * 3 = Hidrometría
  * 4 = Planeación
  * 5 = Programación
  * 6 = Distribución
  * 7 = Entregas
  * 8 = Evaluacion
  * 9 = Consultas
  */
  seleccionado: number;
  //determinara el estido del acordion
  acordionStyle: string;

  constructor() {
    this.mostrar = false;

    this.acordionStyle = 'test1';
  }

  cambiarSubMenu(id: number) {
    this.seleccionado = id;
    this.mostrar = true;
  }

  over(over: boolean) {

    if (over) {
      this.acordionStyle = 'test2';
    } else {
      this.acordionStyle = 'test1';
    }
  }
}
