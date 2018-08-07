import { Component, OnInit, TemplateRef } from '@angular/core';
import { SolicitudRiego } from '../../_model/solicitud-riego';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { PredioService } from '../../_service/predio.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { SolicitudRiegoService } from '../../_service/solicitud-riego.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { splitNamespace } from '@angular/core/src/view/util';
import { Predio } from '../../_model/predio';

@Component({
  selector: 'app-solicitud-riego',
  templateUrl: './solicitud-riego.component.html',
  styleUrls: ['./solicitud-riego.component.css']
})
export class SolicitudRiegoComponent implements OnInit {

  // array donde se almacenaran las solicitudes de riego
  lstSolicitudRiego: SolicitudRiego[];
  // mostrara o ocultar la lista de solicitudes
  seleccionado: boolean;
  // fecha que se usara para la edicion de una solicitud
  fecha: Date;
  strFecha: Date;
  // auto-completer
  searchPredio: string;
  dataServicePredio: CompleterData;
  estado: number;
  modalRef: BsModalRef;
  // id del predio seleccionado
  idPredio: number;
  // nos dira si estamos editando o registrado
  editando: boolean;
  // posicion que se esta editado
  index: number;

  constructor(
    private _localeService: BsLocaleService,
    private spinnerService: Ng4LoadingSpinnerService,
    private predioService: PredioService,
    private completerService: CompleterService,
    private solicitudRiegoService: SolicitudRiegoService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');

    this.dataServicePredio = this.completerService.remote(this.predioService.urlBuscarIdCodigoNombrePorNombreOCodigo, 'nombre,codigo', 'nombre');

    this.resetVariables();
  }

  onPredioSelect(selected: CompleterItem) {

    if (selected) {

      this.spinnerService.show();

      this.idPredio = selected.originalObject.id;

      this.solicitudRiegoService.buscarPorMes(this.idPredio).subscribe(res => {

        // eliminanos cualquier estado anterior
        this.estado = undefined;

        this.lstSolicitudRiego = res;

        this.seleccionado = true;

        this.spinnerService.hide();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });

    } else {
      this.seleccionado = false;
    }
  }

  editar(index: number, template: TemplateRef<any>) {

    console.log(this.lstSolicitudRiego[index].fecha);

    this.fecha = this.lstSolicitudRiego[index].fecha;

    // la fecha la manipulan como una cadena, creamos un objeto date

    let date: string[] = ('' + this.fecha).split('-');

    this.strFecha = new Date(parseInt(date[0]), parseInt(date[0]), parseInt(date[2]));

    console.log(this.strFecha);

    this.editando = true;

    this.index = index;

    this.modalRef = this.modalService.show(template);
  }

  eliminar(index: number) {

    this.spinnerService.show();

    this.solicitudRiegoService.eliminar(this.lstSolicitudRiego[index].id).subscribe(res => {

      this.estado = 1;

      this.lstSolicitudRiego.splice(index, 1);

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  onClickAgregar(template: TemplateRef<any>) {

    this.editando = false;

    this.fecha = undefined;
    this.strFecha = undefined;

    this.modalRef = this.modalService.show(template);
  }

  guardar() {

    this.spinnerService.show();

    // armamos el objeto que sera guardado
    let entity: SolicitudRiego;

    /*
    * si se esta editando tomamos el objeto del array
    */
    if (this.editando) {
      entity = this.lstSolicitudRiego[this.index];
    } else {
      entity = new SolicitudRiego();
    }

    let predio = new Predio();
    predio.id = this.idPredio;
    entity.predioId = predio;
    entity.fecha = this.fecha;

    this.solicitudRiegoService.guardar(entity).subscribe(res => {

      entity.id = res;

      // si se esta registrando agregamos la entidad al array
      if (!this.editando) {
        // agregamos la solicitud al array para ser visualizado
        this.lstSolicitudRiego.push(entity);
      } else {
        // reemplazamos el objeto editado
        this.lstSolicitudRiego[this.index] = entity;
      }

      this.estado = 1;

      this.modalRef.hide();

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  resetVariables() {
    this.lstSolicitudRiego = [];
    this.seleccionado = false;
    this.searchPredio = '';
    this.idPredio = 0;
    this.editando = false;
    this.strFecha = undefined;
  }

}
