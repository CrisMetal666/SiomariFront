import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ManejoAguaService } from '../../_service/manejo-agua.service';
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
  /*
  * determinara si se graficara los datos de una canal, seccion, zona o unidad
  * 1 = unidad
  * 2 = zona
  * 3 = seccion
  * 4 = canal
  * por defecto sera 4
  */
  public tipoConsulta: number;
  // dira si se han seleccionado todos los autocompleter
  public valido: boolean;
  //fecha del datepicker, debe de ser solamente los lunes
  public fecha: Date;
  // sera true si la fecha seleccionada no es un lunes
  public fechaInvalida: boolean;
  // se guardara id del registro, lamina neta, area, caudal diseño consultados
  public data: Array<number>;
  //almacenara la superficie re riego
  public ha: number;
  // se almacenara el gasto necesario que se calculara cuando se modifique el area y recien se consulta la informacion
  public consumo: number;
  // sera true si fue consltado la informacion para asi mostrar el form
  public consultado: boolean;

  constructor(
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private _localeService: BsLocaleService,
    private manejoAguaService: ManejoAguaService,
    private programacionSemanalService: ProgramacionSemanalService
  ) {
    this.tipoConsulta = 4;
    this.valido = false;
    this.fechaInvalida = false;
    this.fecha = new Date();
    this.consultado = false;
  }

  ngOnInit() {

    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');

    //inicializamos el autocompleter
    this.dataCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');

    // inicializamos el auto-completer de unidad
    this.spinnerService.show();

    this.unidadService.listarTodos().subscribe(res => {

      this.dataUnidad = this.completerService.local(res, 'nombre', 'nombre');
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

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
      if (this.tipoConsulta != 1) {

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
      if (this.tipoConsulta == 3) {

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

  consultar() {

    this.spinnerService.show();

    this.manejoAguaService.programacionSemanal(this.idCanal, 4, this.fecha).subscribe(res => {

      // verificamos que el canal si posee la informacion para realizar los calculos
      if (res.length == 0 || res.length == 1) {

        this.data = [0, 0, 0, 0];
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      //guardamos la informacion en el array
      this.data = res;
      //asignamos la superficie para que pueda ser modificada desde el form
      this.ha = res[2];
      //calculamos el consumo de agua
      this.consumo = res[2] * res[1] * 10000 / 604800;
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

  //volvemos a calcular el consumo cuando modifiquen el area
  onKeyUpHa(event: any) {

    this.consumo = this.data[1] * event.target.value * 10000 / 604800;
  }

  /*
   * al seleccionar un item del radio button para mostrar los autocompleter
   * segun el item seleccionado 
   */
  onClickChoose(tipo: number, form) {
    this.tipoConsulta = tipo;
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

  registrar(form) {

    let programacionSemanal: ProgramacionSemanal = new ProgramacionSemanal();

    programacionSemanal.id = this.data[0];
    programacionSemanal.fecha = this.fecha;
    programacionSemanal.lamina = this.data[1];
    programacionSemanal.area = this.ha;
    programacionSemanal.canalId = this.idCanal;

    this.spinnerService.show();

    this.programacionSemanalService.guardar(programacionSemanal).subscribe(res => {

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
