import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ProgramacionSemanal } from '../../_model/programacion-semanal';
import { ProgramacionSemanalService } from '../../_service/programacion-semanal.service';

@Component({
  selector: 'app-programacion-semanal',
  templateUrl: './programacion-semanal.component.html',
  styleUrls: ['./programacion-semanal.component.css']
})
export class ProgramacionSemanalComponent implements OnInit {

  //autocompleter
  public dataCanal: CompleterData;
  //id seleccionado en el autocompleter
  public idCanal: number;
  public sCanal: string;
  //segun el valor numerico mostrara un mensaje al usuario
  public estado: number;
  //fecha del datepicker, debe de ser solamente los lunes
  public fecha: Date;
  // sera true si la fecha seleccionada no es un lunes
  public fechaInvalida: boolean;
  // se guardara la informacion consultada y se usara para enviar los datos a guardar
  public programacionSemanal: ProgramacionSemanal;
  // se almacenara el gasto necesario que se calculara cuando se modifique el area y recien se consulta la informacion
  public consumo: number;
  // sera true si fue consltado la informacion para asi mostrar el form
  public consultado: boolean;

  constructor(
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private _localeService: BsLocaleService,
    private programacionSemanalService: ProgramacionSemanalService
  ) {
    this.fechaInvalida = false;
    this.fecha = new Date();
    this.consultado = false;
  }

  ngOnInit() {

    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');

    //inicializamos el autocompleter
    this.dataCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigoNoServidores, 'nombre,codigo', 'nombre');
  }

  onSourceSelect(selected: CompleterItem) {

    this.idCanal = 0;

    if (selected) {
      this.idCanal = selected.originalObject.id;
    }
  }

  consultar() {

    this.spinnerService.show();

    this.programacionSemanalService.programacionSemanal(this.idCanal, 4, this.fecha).subscribe(res => {
      
      // verificamos que el canal si posee la informacion para realizar los calculos
      if (res.area == 0) {

        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      //guardamos la informacion en el array
      this.programacionSemanal = res;
      //calculamos el consumo de agua
      this.consumo = res.caudal;
      //borramos cualquier estado que pudiera haber
      this.estado = undefined;
      //mostramos el form
      this.consultado = true;

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

  }

  //volvemos a calcular el consumo cuando modifiquen el area o la lamina
  onKeyUp() {

    this.consumo = this.programacionSemanal.lamina * this.programacionSemanal.area * 10000 / 604800;
  }

  registrar(form) {

    // se tenia problemas al obtener la fecha asi que tomamos los valores por separado para no tener erroes
    let year:number = this.fecha.getFullYear();
    let month = this.fecha.getMonth();
    let day = this.fecha.getDate();

    let d = new Date(year,month,day);

    this.programacionSemanal.fecha = d;

    this.spinnerService.show();

    // almacenamos el consumo que es posible que se haya modificado desde el formulario
    this.programacionSemanal.caudal = this.consumo;

    this.programacionSemanalService.guardar(this.programacionSemanal).subscribe(res => {

      this.estado = 1;
      form.reset();
      this.consultado = false;

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

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

}
