import { Component, OnInit, TemplateRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ConsultaCanal } from '../../_model/consulta-canal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CanalObra } from '../../_model/canal-obra';
import { DomSanitizer } from '@angular/platform-browser';
import { CanalObraService } from '../../_service/canal-obra.service';
import { EstructuraControl } from '../../_model/estructura-control';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-consulta-canal',
  templateUrl: './consulta-canal.component.html',
  styleUrls: ['./consulta-canal.component.css']
})
export class ConsultaCanalComponent implements OnInit {

  canal: ConsultaCanal;
  dataServiceCanal: CompleterData;
  consultado: boolean;
  estado: number;
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  modalGrafica: BsModalRef;
  modalMapa:BsModalRef;
  canalObraDetalle: CanalObra;
  imgByte;
  // lineChart
  chart;
  estructuraControl: EstructuraControl;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private completerService: CompleterService,
    private modalService: BsModalService,
    private sanitization: DomSanitizer,
    private canalObraService: CanalObraService
  ) { }

  ngOnInit() {
    //inicializamos el auto-completer
    this.dataServiceCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');
    this.consultado = false;
  }

  //evento del autocompleter buscar canal
  onSelectedCanal(selected: CompleterItem) {

    if (selected) {

      this.spinnerService.show();

      this.canalService.consultaCompleta(selected.originalObject.id).subscribe(res => {

        this.canal = res;
        this.estado = undefined;
        this.consultado = true;
        this.spinnerService.hide();

      }, err => {
        this.consultado = false;
        this.estado = 0;
        this.spinnerService.hide();
      });

    }
  }

  obraDetalle(indexObra: number, indexDetalle: number, template: TemplateRef<any>) {

    this.canalObraDetalle = this.canal.lstObraDetalle[indexObra].lstCanalObra[indexDetalle];

    if (this.canalObraDetalle.imagen != null) {

      this.canalObraService.verImagen(this.canalObraDetalle.imagen).subscribe(res => {

        var reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onloadend = () => {
          let x = reader.result;

          this.modalRef = this.modalService.show(template);

          this.imgByte = this.sanitization.bypassSecurityTrustResourceUrl(x);
        }

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });

    } else {
      this.imgByte = undefined;
      this.modalRef = this.modalService.show(template);
    }

  }

  imagenObra(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'second modal-lg' });
  }

  onClickEstructura(index: number, template: TemplateRef<any>) {

    this.modalGrafica = this.modalService.show(template, { class: 'modal-lg' });

    this.estructuraControl = this.canal.lstEstructuraControl[index];

    this.grafica();
  }

  grafica() {

    // verificamos que la estructura haya sido calibrada
    if (this.estructuraControl.coeficiente == null || this.estructuraControl.exponente == null) {
      if (this.chart) {
        this.chart.destroy();
      }
      return;
    }

    // destruimos cualquier grafica existente para no tener errores de animacion
    if (this.chart) {
      this.chart.destroy();
    }

    let y: number[] = [];

    //calculamos los valores para graficarlos
    for (let i = 0; i <= 600; i += 50) {

      let p = this.estructuraControl.coeficiente * Math.pow(i, this.estructuraControl.exponente);
      y.push(p);

    }

    let x: Array<any> = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
    
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: x,
        datasets: [
          {
            label: 'Curva de calibración',
            steppedLine: false,
            data: y,
            borderColor: "#3cba9f",
            fill: false,
            backgroundColor: [
              'rgba(148,159,177,0)',
              '#FF8000',
              'rgba(148,159,177,1)',
              '#fff',
              '#fff',
              'rgba(148,159,177,0.8)'
            ]
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Curva de calibración',
          fontSize: 20
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Caudal (L/s)',
              fontColor: '#000'
            },

          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Tirante de agua (m)',
              fontColor: '#000'
            }
          }],
        }
      }
    });
  }

  georreferenciacion(template: TemplateRef<any>) {

    this.modalMapa = this.modalService.show(template, { class: 'second modal-lg' });
  }

}
