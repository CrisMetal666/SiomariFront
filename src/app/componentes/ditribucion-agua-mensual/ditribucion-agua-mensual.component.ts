import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DistribucionAgua } from '../../_model/distribucionAgua';
import { EntregaService } from '../../_service/entrega.service';

@Component({
  selector: 'app-ditribucion-agua-mensual',
  templateUrl: './ditribucion-agua-mensual.component.html',
  styleUrls: ['./ditribucion-agua-mensual.component.css']
})
export class DitribucionAguaMensualComponent implements OnInit {

  //fecha del datepicker, debe de ser solamente los lunes
  fecha: Date;
  // usados para armas la tabla de la vista
  lstDistribucionAgua: DistribucionAgua[];
  total: DistribucionAgua;
  // mosttara un mensaje al usuario dependiendo del valor numerico
  estado: number;
  // si es true mostrara la tabla si es false no la mostrara
  consultado: boolean;
  constructor(
    private _localeService: BsLocaleService,
    private spinnerService: Ng4LoadingSpinnerService,
    private entregaService: EntregaService
  ) { }

  ngOnInit() {
    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');
  }

  consultar() {

    this.spinnerService.show();

    this.entregaService.distribucionAgua(1, 1, this.fecha).subscribe(res => {

      let length = res.length;

      if (length == 0) {
        this.estado = 2;
        this.consultado = false;
        this.spinnerService.hide();
        return;
      }

      // separamos el total y los demas datos del array
      this.total = res[length - 1];
      this.lstDistribucionAgua = res.splice(0, length - 1);

      this.consultado = true;

      this.estado = undefined; // borramos cualquier posible mensaje
      this.spinnerService.hide();


    }, err => {
      this.estado = 0;
      this.consultado = false;
      this.spinnerService.hide();
    });
  }

}
