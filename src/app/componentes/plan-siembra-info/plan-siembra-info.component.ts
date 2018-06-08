import { Component, OnInit } from '@angular/core';
import { CultivoPredioService } from '../../_service/cultivo-predio.service';
import { PlaneacionInfo } from '../../_model/planeacion-info';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-plan-siembra-info',
  templateUrl: './plan-siembra-info.component.html',
  styleUrls: ['./plan-siembra-info.component.css']
})
export class PlanSiembraInfoComponent {

  //lista con la informacion que se mostrara al usuario al momento que den la orden de buscar
  public lstPlaneacionInfo: any[][] = [];
  //dependiendo del valor numerico se mostrara un mensaje al usuario
  public estado: number;
  public year: number;
  public campania: string;
  //ayudara a controlar el mensaje al usuario cuando no haya informacion
  public consultado: boolean;

  constructor(
    private cultivoPredioService: CultivoPredioService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.campania = ''; 
    this.year = new Date().getFullYear();
    this.lstPlaneacionInfo = [];
  }

  consultar() {

    this.spinnerService.show();

    this.cultivoPredioService.planeacionInfoDemanda(this.year, this.campania).subscribe(res => {

      this.lstPlaneacionInfo = res;
      this.consultado = true;
      this.spinnerService.hide();

      console.log(this.lstPlaneacionInfo.length);

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

}
