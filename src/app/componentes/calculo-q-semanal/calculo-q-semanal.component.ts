import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ProgramacionSemanalService } from '../../_service/programacion-semanal.service';
import { ProgramacionSemanal } from '../../_model/programacion-semanal';

@Component({
  selector: 'app-calculo-q-semanal',
  templateUrl: './calculo-q-semanal.component.html',
  styleUrls: ['./calculo-q-semanal.component.css']
})
export class CalculoQSemanalComponent implements OnInit {

  //autocompleter
  public dataCanal: CompleterData;
  //id seleccionado en el autocompleter
  public idCanal: number;
  //segun el valor numerico mostrara un mensaje al usuario
  public estado: number;
  // sera true si la fecha seleccionada no es un lunes
  public fechaInvalida: boolean;
  // guardaremos los datos consultados para mostrarlo 
  public programacionSemanal: ProgramacionSemanal;
  //calculo del caudal total para ser mostrado (caudalSolicitado * factor)
  public caudalTotal: number;
  // caudal solicitado (lamina * area )
  public caudalSolicitado: number;
  //fecha del datepicker, debe de ser solamente los lunes
  public fecha: Date;
  // mostrara el panel cuando ya se haya hecho una consulta
  public consultado: boolean;

  constructor(
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private _localeService: BsLocaleService,
    private programacionSemanalService: ProgramacionSemanalService
  ) { 
    this.programacionSemanal = new ProgramacionSemanal();
    this.consultado = false;
  }

  ngOnInit() {

    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');

    //inicializamos el autocompleter
    this.dataCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');
  }

  onSourceSelect(selected: CompleterItem) {

    this.idCanal = 0;

    if (selected) {
      this.idCanal = selected.originalObject.id;
    }
  }

  //nos aseguraremos que la fecha seleccionada sea un lunes
  onValueChange(value: Date): void {

    if (value == null) {
      this.fechaInvalida = false;
    } else if (value.getDay() != 1) {
      this.fechaInvalida = true;
    } else {
      this.fechaInvalida = false;
    }
  }

  consultar() {

    this.spinnerService.show();

    this.programacionSemanalService.buscarPorFechaYCanalId(this.idCanal, this.fecha).subscribe(res => {

      if(res == null) {
        this.estado = 2;
        this.consultado = false;
        this.spinnerService.hide();
        return;
      }

      this.programacionSemanal = res;
      this.caudalSolicitado = this.programacionSemanal.lamina * this.programacionSemanal.area * 10000 / 604800;
      this.caudalTotal = this.caudalSolicitado * (1 / this.programacionSemanal.eficiencia);

      this.estado = undefined;
      this.consultado = true;

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.consultado = false;
      this.spinnerService.hide();
    });
  }

}
