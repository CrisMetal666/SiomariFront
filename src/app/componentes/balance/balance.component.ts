import { Component } from '@angular/core';
import { PlaneacionInfo } from '../../_model/planeacion-info';
import { CultivoPredioService } from '../../_service/cultivo-predio.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent {

  public balance: PlaneacionInfo[];
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
    this.balance = [];
  }

  consultar() {

    this.spinnerService.show();

    this.cultivoPredioService.demandaTotalDecadal(this.year, this.campania).subscribe(res => {

      this.balance = res;
      this.consultado = true;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

}
