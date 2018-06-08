import { Component, OnInit } from '@angular/core';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PredioService } from '../../_service/predio.service';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { Predio } from '../../_model/predio';
import { Entrega } from '../../_model/entrega';
import { EntregaService } from '../../_service/entrega.service';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css']
})
export class EntregaComponent implements OnInit {

  //auto-completer
  public searchPredio: string;
  public dataServicePredio: CompleterData;
  //guardaremos el id del predio seleccionado
  public predio: Predio;
  // se guarda el rango que fechas
  public fechaEntrega: Date;
  public fechaSuspension: Date;
  //fecha minima de la fecha de suspension
  public minDate: Date;
  //guarda un valor numerico para mostrar un mensaje al usuario
  public estado: number;


  constructor(
    private completerService: CompleterService,
    private predioService: PredioService,
    private spinnerService: Ng4LoadingSpinnerService,
    private _localeService: BsLocaleService,
    private entregaService: EntregaService
  ) { }

  ngOnInit() {
    this.resetVariables();
    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');
    //inicializamos los autocompleter
    this.dataServicePredio = this.completerService.remote(this.predioService.urlBuscarIdCodigoNombrePorNombreOCodigo, 'codigo,nombre', 'nombre');
  }

  onPredioSelect(selected: CompleterItem) {
    if (selected) {
      this.predio = new Predio();
      this.predio.id = selected.originalObject.id;
    } else {
      this.predio = null;
    }
  }

  registrar(form) {

      let entrega = new Entrega();
      entrega.entrega = this.fechaEntrega;
      entrega.suspension = this.fechaSuspension;
      entrega.predioId = this.predio;

      this.spinnerService.show();

      this.entregaService.registrar(entrega).subscribe(res => {

        this.estado = 1;
        this.spinnerService.hide();

        this.resetVariables();
        form.reset();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
  }

  resetVariables() {
    this.predio = null;
    this.searchPredio = '';
    this.fechaEntrega = undefined;
    this.fechaSuspension = undefined;
  }

}
