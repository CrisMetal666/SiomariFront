import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  nombreSistema: string;
  nombreDistrito: string;

  constructor() {
    this.nombreSistema = "SISTEMA DE INFORMACIÓN OPERACIONAL PARA LA OPTIMIZACIÓN HIDRÁULICA EN EL MANEJO DEL AGUA DE RIEGO";
    this.nombreDistrito = "Distrito de Adecuación de Tierras de Mediana Escala El Juncal";
  }

  ngOnInit() {
  }

}
