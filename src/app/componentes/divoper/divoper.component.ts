import { Component, OnInit, ViewChild } from '@angular/core';
import { Divoper } from '../../_model/divoper';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';
import { DistritoService } from '../../_service/distrito.service';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-divoper',
  templateUrl: './divoper.component.html',
  styleUrls: ['./divoper.component.css']
})
export class DivoperComponent implements OnInit {

  // objeto principal que contendra la informacion
  divoper: Divoper;
  //pagina actual de las tablas
  pageCanal: number;
  pagePredio: number;
  pageDivision: number;
  // false si no se ha consultado
  consultado: boolean;
  // mostrar o ocultara los autocompleter dependiendo que radio boton haya sido seleccionada
  tipo: number;
  //autocompleter
  public dataUnidad: CompleterData;
  public dataSeccion: CompleterData;
  public dataZona: CompleterData;
  //id seleccionado en el autocompleter
  public idUnidad: number;
  public idZona: number;
  public idSeccion: number;
  public sUnidad: string;
  public sZona: string;
  public sSeccion: string;
  //determinara si los autocompleter han sido llenados correctamente
  valido: boolean;
  //segun el vlaor numerico, se mostrara un mensaje al usuario
  public estado: number;
  // titulo de unidad, zona o seccion, segun lo seleccionado
  titleDivision: string;
  // referenciamos el tab para poder seleccionar el tab inicial
  @ViewChild('tabSeleccion') 
  tabSeleccion: TabsetComponent;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private completerService: CompleterService,
    private distritoService: DistritoService
  ) {
    this.consultado = false;
    this.tipo = 1;
  }

  ngOnInit() {

    this.tabSeleccion.tabs[1].active = true;

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
    this.sUnidad = '';
    this.sSeccion = '';
    this.sZona = '';
    this.consultado = false;

    // determinamos el titulo
    if(tipo == 0) {

      this.titleDivision = 'Unidades';
      // como para el distrito no necesitamos informacion, consultamos directamente
      this.consultar();

    } else if(tipo == 1) {

      this.titleDivision = 'Zonas';

    } else if(tipo == 2) {

      this.titleDivision = 'Secciones';

    }

    //reseteamos el form donde estan los autocompleter
    form.reset();
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

  consultar() {

    let id = 0;

    // tomamos el id dependiendo del boton seleccionado
    if (this.tipo == 0) {

    } else if (this.tipo == 1) {

      id = this.idUnidad;

    } else if (this.tipo == 2) {

      id = this.idZona;

    } else if (this.tipo == 3) {

      id = this.idSeccion;

    } else {
      this.estado = 0;
      return;
    }

    this.spinnerService.show();

    this.distritoService.consultaGeneral(id, this.tipo).subscribe(res => {

      // inicializamos las paginas
      this.pageCanal = 1;
      this.pagePredio = 1;
      this.pageDivision = 1;

      // borramos estados anteriores
      this.estado = undefined;

      // mostramos el formulario
      this.consultado = true;

      this.divoper = res;

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.consultado = false;
      this.spinnerService.hide();
    });
  }

}
