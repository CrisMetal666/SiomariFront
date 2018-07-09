import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ProgramacionSemanalService } from '../../_service/programacion-semanal.service';
import { ProgramacionSemanal } from '../../_model/programacion-semanal';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';

@Component({
  selector: 'app-calculo-q-semanal',
  templateUrl: './calculo-q-semanal.component.html',
  styleUrls: ['./calculo-q-semanal.component.css']
})
export class CalculoQSemanalComponent implements OnInit {

  //autocompleter
  public dataCanal: CompleterData;
  public dataUnidad: CompleterData;
  public dataSeccion: CompleterData;
  public dataZona: CompleterData;
  //id seleccionado en el autocompleter
  public idCanal: number;
  public idUnidad: number;
  public idZona: number;
  public idSeccion: number;
  public sCanal: string;
  public sUnidad: string;
  public sZona: string;
  public sSeccion: string;
  //segun el valor numerico mostrara un mensaje al usuario
  public estado: number;
  // sera true si la fecha seleccionada no es un lunes
  public fechaInvalida: boolean;
  // guardaremos los datos consultados para mostrarlo 
  public programacionSemanal: ProgramacionSemanal;
  //calculo del caudal total para ser mostrado (caudalSolicitado * factor)
  public caudalTotal: number;
  //fecha del datepicker, debe de ser solamente los lunes
  public fecha: Date;
  // mostrara el panel cuando ya se haya hecho una consulta
  public consultado: boolean;
  /*
  * determinara si se consultara canal, seccion, zona o unidad
  * 1 = unidad
  * 2 = zona
  * 3 = seccion
  * 4 = canal
  * por defecto sera 4
  */
  public tipo: number;
  // dira si se han seleccionado todos los autocompleter
  public valido: boolean;
  // el factor es el inverso de la eficiencia
  public factor: number;

  constructor(
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private _localeService: BsLocaleService,
    private programacionSemanalService: ProgramacionSemanalService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService
  ) {
    this.programacionSemanal = new ProgramacionSemanal();
    this.consultado = false;
    this.tipo = 4;
  }

  ngOnInit() {

    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');

    //inicializamos el autocompleter
    this.dataCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigoNoServidores, 'nombre,codigo', 'nombre');

    // inicializamos el auto-completer de unidad
    this.spinnerService.show();

    this.unidadService.listarTodos().subscribe(res => {

      this.dataUnidad = this.completerService.local(res, 'nombre', 'nombre');
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

    // inicializamos la informacion de los autocompleter para no tener errores
    this.dataZona = this.completerService.local([], '');
    this.dataSeccion = this.completerService.local([], '');
  }

  onSourceSelect(selected: CompleterItem) {

    this.idCanal = 0;
    this.valido = false;

    if (selected) {
      this.idCanal = selected.originalObject.id;
      this.valido = true;
    }
  }

  onUnidadSelect(selected: CompleterItem) {

    this.idUnidad = 0;
    this.valido = false;
    //limpiamos los autocompleter en cascada
    this.idZona = 0;
    this.sZona = '';
    this.idSeccion = 0;
    this.sSeccion = '';

    if (selected) {

      this.idUnidad = selected.originalObject.id;
      this.valido = true;

      // buscamos las zonas de la unidad solo si esta seleccionado zona o seccion (radio boton)
      if (this.tipo != 1) {

        this.valido = false;

        this.spinnerService.show();

        this.zonaService.buscarPorUnidadId(this.idUnidad).subscribe(res => {

          this.dataZona = this.completerService.local(res, 'nombre', 'nombre');
          this.spinnerService.hide();

        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });
      }
    }
  }

  onZonaSelect(selected: CompleterItem) {

    this.idZona = 0;
    this.valido = false;

    //limpiamos los valores de la seccion
    this.idSeccion = 0;
    this.sSeccion = '';

    if (selected) {

      this.idZona = selected.originalObject.id;
      this.valido = true;

      //se buscaran las secciones si esta seleccionado la seccion (radio boton)
      if (this.tipo == 3) {

        this.spinnerService.show();

        this.valido = false;

        this.seccionService.buscarPorZonaId(this.idZona).subscribe(res => {

          this.dataSeccion = this.completerService.local(res, 'nombre', 'nombre');
          this.spinnerService.hide();

        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        })
      }
    }
  }

  onSeccionSelect(selected: CompleterItem) {

    this.idSeccion = 0;
    this.valido = false;

    if (selected) {
      this.idSeccion = selected.originalObject.id;
      this.valido = true;
    }
  }

  /*
   * al seleccionar un item del radio button para mostrar los autocompleter
   * segun el item seleccionado 
   */
  onClickChoose(tipo: number, form) {
    this.tipo = tipo;
    //reinisiamos los id de los autocompleter
    this.idUnidad = 0;
    this.idSeccion = 0;
    this.idZona = 0;
    this.idCanal = 0;
    this.sUnidad = '';
    this.sSeccion = '';
    this.sZona = '';
    this.sCanal = '';

    //reseteamos el form donde estan los autocompleter
    form.reset();
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

    // establecemos el id que vamos a enviar al servidor
    let id = 0;

    // verificamos si tenemos que consultar la unidad, zona o seccion
    if (this.tipo == 1) {

      id = this.idUnidad;

    } else if (this.tipo == 2) {

      id = this.idZona;

    } else if (this.tipo == 3) {

      id = this.idSeccion;

    } else if (this.tipo == 4) {

      id = this.idCanal;

    } else return;

    this.programacionSemanalService.calculoCaudalSemanal(this.fecha, id, this.tipo).subscribe(res => {

      // si el id es -1 significa que no se han especificado los canales servidores
      if (res.id == -1) {
        this.estado = 2;
        this.consultado = false;
        this.spinnerService.hide();
        return;
      }

      this.programacionSemanal = res;

      if (this.programacionSemanal.eficiencia == 0 || this.programacionSemanal.eficiencia == undefined) {
        this.factor = 0;
      } else {
        this.factor = Math.round((1 / this.programacionSemanal.eficiencia) * 100) / 100;
      }

      this.caudalTotal = res.caudal * this.factor;

      this.estado = undefined;
      this.consultado = true;

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.consultado = false;
      this.spinnerService.hide();
    });

  }

  guardar() {

    this.spinnerService.show();

    if (this.factor == 0 || this.factor == undefined) {
      this.programacionSemanal.eficiencia = 0;
    } else {
      this.programacionSemanal.eficiencia = Math.pow(this.factor, -1);
    }

    this.programacionSemanalService.guardar(this.programacionSemanal).subscribe(res => {

      this.estado = 1;
      this.programacionSemanal = new ProgramacionSemanal();
      this.consultado = false;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  onKeyUpFactor() {
    this.caudalTotal = this.programacionSemanal.caudal * this.factor;
  }

}
