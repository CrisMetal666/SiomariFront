import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DistribucionAgua } from '../../_model/distribucionAgua';
import { EntregaService } from '../../_service/entrega.service';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';
import { CanalService } from '../../_service/canal.service';

@Component({
  selector: 'app-ditribucion-agua-mensual',
  templateUrl: './ditribucion-agua-mensual.component.html',
  styleUrls: ['./ditribucion-agua-mensual.component.css']
})
export class DitribucionAguaMensualComponent implements OnInit {

  /*
  * determinara si se consultara canal, seccion, zona o unidad
  * 1 = unidad
  * 2 = zona
  * 3 = seccion
  * 4 = canal
  * por defecto sera 4
  */
  tipo: number;
  // dira si se han seleccionado todos los autocompleter
  valido: boolean;
  //autocompleter
  dataCanal: CompleterData;
  dataUnidad: CompleterData;
  dataSeccion: CompleterData;
  dataZona: CompleterData;
  //id seleccionado en el autocompleter
  public idCanal: number;
  public idUnidad: number;
  public idZona: number;
  public idSeccion: number;
  public sCanal: string;
  public sUnidad: string;
  public sZona: string;
  public sSeccion: string;
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
    private entregaService: EntregaService,
    private completerService: CompleterService,
    private canalService: CanalService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService
  ) { 
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
      console.log(err);
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

  /*
   * al seleccionar un item del radio button para mostrar los autocompleter
   * segun el item seleccionado 
   */
  onClickChoose(tipo: number, form) {

    console.log(tipo);

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

    let id = 0;

    // tomamos el id que corresponda segun el tipo
    if(this.tipo == 1) {

      id = this.idUnidad;

    } else if(this.tipo == 2) {

      id = this.idZona;
      
    } else if(this.tipo == 3) {

      id = this.idSeccion;
      
    } else if(this.tipo == 4) {

      id = this.idCanal;
      
    } else {
      this.spinnerService.hide();
      return;
    }

    console.log(id + ' ' +this.tipo+' '+ this.fecha);

    this.entregaService.distribucionAgua(id, this.tipo, this.fecha).subscribe(res => {

      console.log(res);

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
