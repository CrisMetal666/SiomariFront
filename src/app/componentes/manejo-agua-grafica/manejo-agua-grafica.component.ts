import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manejo-agua-grafica',
  templateUrl: './manejo-agua-grafica.component.html',
  styleUrls: ['./manejo-agua-grafica.component.css']
})
export class ManejoAguaGraficaComponent implements OnInit {

  //plaholder del autocompleter
  public textCompleter: string;
  // rango de fecha seleccionado
  public fecha: Date[];
  // lineChart
  public lineChartData: Array<any> = [
    { data: [30,40,50,60,54,56,58,58,60,62,62,65,60,62,62,65,65,65,62,56,70,66,33,55,78,76,77,54,56,78], label: 'Eficiencia' },
    { data: [55,40,30,20,25,20,18,18,15,15,13,16,15,15,13,13,13,15,16,20,15,20,21,22,15,14,16,16,16,15], label: 'Lam' },
    { data: [45,30,20,10,15,10,8,8,5,5,3,6,5,5,3,3,3,5,6,10,5,10,11,12,5,4,6,6,6,5], label: 'Lan' }
  ];
  public lineChartLabels: Array<any> = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { 
      backgroundColor: 'rgba(148,159,177,0)',
      borderColor: '#FF8000',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { 
      backgroundColor: 'rgba(148,159,177,0)',
      borderColor: '#CDDC39',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { 
      backgroundColor: 'rgba(148,159,177,0)',
      borderColor: '#009688',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public mostrarGrafica: boolean;

  constructor() { 
    this.mostrarGrafica = false;
    this.textCompleter = 'Buscar canal';
  }

  ngOnInit() {
  }

}
