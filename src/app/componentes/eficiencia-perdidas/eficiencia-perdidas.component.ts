import { Component, OnInit } from '@angular/core';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';
import { ManejoAguaService } from '../../_service/manejo-agua.service';
import { EficienciaPerdidas } from '../../_model/eficiencia-perdidas';

@Component({
  selector: 'app-eficiencia-perdidas',
  templateUrl: './eficiencia-perdidas.component.html',
  styleUrls: ['./eficiencia-perdidas.component.css']
})
export class EficienciaPerdidasComponent implements OnInit {

  // rango de fecha seleccionado
  public fecha: Date[];
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
  // almacenaremos la informacion de la consulta para ser mostrado al usuario
  public eficienciaPerdidas: EficienciaPerdidas;

  constructor(
    private _localeService: BsLocaleService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private canalService: CanalService,
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private manejoAguaService: ManejoAguaService
  ) {
    this.consultado = false;
    this.tipo = 4;
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

  consultar() {

    let id = 0;

    // almanecamos el id dependiendo de si se trata de una unidad, zona, seccion o canal
    if (this.tipo == 1) {

      id = this.idUnidad;

    } else if (this.tipo == 2) {

      id = this.idZona;

    } else if (this.tipo == 3) {

      id = this.idSeccion;

    } else if (this.tipo == 4) {

      id = this.idCanal;

    } else return;

    this.spinnerService.show();

    this.manejoAguaService.calcularEficienciaPerdidas(id, this.tipo, this.fecha[0],
      this.fecha[1]).subscribe(res => {

        this.eficienciaPerdidas = res;
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
