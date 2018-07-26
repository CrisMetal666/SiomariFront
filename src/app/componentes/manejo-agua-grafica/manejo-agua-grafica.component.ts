import { Component, OnInit } from '@angular/core';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { ManejoAguaService } from '../../_service/manejo-agua.service';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';
import { Chart } from 'chart.js';
import { LnLamEficiencia } from '../../_model/lnLamEficiencia';

@Component({
  selector: 'app-manejo-agua-grafica',
  templateUrl: './manejo-agua-grafica.component.html',
  styleUrls: ['./manejo-agua-grafica.component.css']
})
export class ManejoAguaGraficaComponent implements OnInit {

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
  //segun el vlaor numerico, se mostrara un mensaje al usuario
  public estado: number;
  // lineChart
  chart;
  /*
  * determinara si se graficara los datos de una canal, seccion, zona o unidad
  * 1 = unidad
  * 2 = zona
  * 3 = seccion
  * 4 = canal
  * por defecto sera 4
  */
  public tipoGrafico: number;
  // dira si se han seleccionado todos los autocompleter
  public valido: boolean;

  constructor(
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private _localeService: BsLocaleService,
    private canalService: CanalService,
    private manejoAguaService: ManejoAguaService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService
  ) {
    this.tipoGrafico = 4;
    this.valido = false;
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
      if (this.tipoGrafico != 1) {

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
      if (this.tipoGrafico == 3) {

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
    this.tipoGrafico = tipo;
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

    this.spinnerService.show();

    // guardaremos el id segun el tipo que se escoja 
    let id = 0;

    if (this.tipoGrafico == 1) {

      id = this.idUnidad;

    } else if (this.tipoGrafico == 2) {

      id = this.idZona;

    } else if (this.tipoGrafico == 3) {

      id = this.idSeccion;

    } else if (this.tipoGrafico == 4) {

      id = this.idCanal;

    } else {
      return;
    }

    this.manejoAguaService.calcularLanLamEfic(this.fecha[0], this.fecha[1], id,
      this.tipoGrafico).subscribe(res => {

        this.estado = undefined;

        console.log(res);

        //si la lista esta vacia mostramos un mensaje al usuario
        if (res.lstEfic == null) {
          this.estado = 2;
          if (this.chart) {
            this.chart.destroy();
          }
          this.spinnerService.hide();
          return;
        }

        this.crearGrafica(res);

        this.spinnerService.hide();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
  }

  private crearGrafica(data: LnLamEficiencia) {

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: data.lstFecha,
        datasets: [
          {
            label: 'Eficiencia',
            steppedLine: false,
            data: data.lstEfic,
            yAxisID: 'porcentaje',
            borderColor: "#C3000E",
            fill: false,
            backgroundColor: [
              '#C3000E'
            ],
          },
          {
            label: 'Ln',
            steppedLine: false,
            data: data.lstLn,
            yAxisID: 'porcentaje',
            borderColor: "#9DB9FF",
            fill: false,
            backgroundColor: [
              '#9DB9FF'
            ],
          },
          {
            label: 'Lam',
            steppedLine: false,
            data: data.lstLam,
            yAxisID: 'porcentaje',
            borderColor: "#3F00A7",
            fill: false,
            backgroundColor: [
              '#3F00A7'
            ],
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Grafica de Eficiencia - Lamina - Tiempo',
          fontSize: 20
        },
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Fecha',
              fontColor: '#000'
            }
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'porcentaje',
            scaleLabel: {
              display: true,
              labelString: 'Eficiencia (%)',
              fontColor: '#000'
            }
          },
          {
            type: 'linear',
            display: true,
            position: 'right',
            id: 'lamina',
            scaleLabel: {
              display: true,
              labelString: 'Lamina (cm)',
              fontColor: '#000'
            },
            ticks: {
              display: false
            },
            gridLines: {
              display: false
            }
          }],
        }
      }
    });
  }

}
