import { Component, OnInit } from '@angular/core';
import { EstructuraControlService } from '../../_service/estructura-control.service';
import { EstructuraControl } from '../../_model/estructura-control';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { Canal } from '../../_model/canal';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-estructura-control',
  templateUrl: './estructura-control.component.html',
  styleUrls: ['./estructura-control.component.css']
})
export class EstructuraControlComponent implements OnInit {

  // segun el valor mostraremos el formulario de registro, calibracion o la grafica
  public option: number;
  //objeto principal donde se guardara la informacion en memoria
  public estructura: EstructuraControl;
  //informacion para la calibracion de la estructura de control
  public datoY: number;
  public datoX: number;
  //index de el dato de calibracion a editar
  public reemplazarIndex: number;
  //determinara si se esta agregando o editando datos de la calibracion
  public reemplazar: boolean;
  //lista donde se guardan todos los puntos de la calibracion
  public lstX: number[];
  public lstY: number[];
  //especificara si se ha seleccionado una estructura para la calibracion
  public calibrar: boolean;
  //auto-completer
  public dataServiceEstructura: CompleterData;
  public dataServiceEstructuraGraficar: CompleterData;
  public dataServiceCanal: CompleterData;
  public estructuraCompleter: string;
  public canalCompleter: string;
  //mostrara un mensaje al usuario dependiendo del valor numerico
  public estado: number;
  // lineChart
  chart;
  // nos dira si debemos mostrar la grafica
  public graficar: boolean;
  //dira si hay ecuacion de calibracion
  public ecuacion: boolean;
  // coeficiente y exponene de la ecuacion
  public a: number;
  public b: number;

  constructor(
    private estructuraControlService: EstructuraControlService,
    private completerService: CompleterService,
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService
  ) { }

  ngOnInit() {
    this.resetVariables();
    this.dataServiceEstructura = this.completerService.remote(this.estructuraControlService.buscarPorCodigoUrl, 'codigo', 'codigo');
    this.dataServiceEstructuraGraficar = this.completerService.remote(this.estructuraControlService.buscarCodigoCoeficienteExponentePorCodigo, 'codigo', 'codigo');
    this.dataServiceCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');
  }

  registrar(form) {

    this.spinnerService.show();

    // verificamos que el codigo no exista en la base de datos
    this.estructuraControlService.buscarIdPorCodigo(this.estructura.codigo).subscribe(res => {

      if (res.id != 0) {
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      // registramos
      this.estructuraControlService.registrar(this.estructura).subscribe(res => {

        this.resetVariables();
        this.estado = 1;
        form.reset();
        this.spinnerService.hide();

      }, err => {
        this.spinnerService.hide();
        this.estado = 0;
      });

    }, err => {
      this.spinnerService.hide();
      this.estado = 0;
    });


  }

  //tomamos el valor del select para asi mostrar el div correspondiente
  onChangeOption(event: any) {
    this.resetVariables();
    this.estado = undefined;
    this.option = event.target.value;
  }

  //iniciamos la fase de edicion en calibrar
  onClickReemplazarEditar(index: number) {
    this.reemplazar = true;
    this.datoX = this.lstX[index];
    this.datoY = this.lstY[index];
    this.reemplazarIndex = index;
  }

  //se cancela la estructura control seleccionada para calibrarla
  onClickCalibrarCancelar(form) {
    this.resetVariables();
    form.reset();
  }

  //necesario para la validacion del formulario de registro
  onKeyUpCanal() {
    this.estructura.canalId = null;
  }

  onSelectedCanal(selected: CompleterItem) {

    if (selected) {
      let canal = new Canal();
      canal.id = selected.originalObject.id;
      this.estructura.canalId = canal;
    }
  }

  onSelectedEstructura(selected: CompleterItem) {

    if (selected) {
      this.estructura = new EstructuraControl();
      this.estructura.id = selected.originalObject.id;
      this.estructura.codigo = selected.originalObject.codigo;

      let canal = new Canal();
      canal.id = selected.originalObject.canalId.id;

      this.estructura.canalId = canal;
      this.calibrar = true;
    }
  }

  //agregamos los datos de calibracion
  onClickAgregar(form) {

    //no podemos permitir el valor 0, ya que se usan logaritmos de base 10 para los calculos
    if (this.datoX == 0 || this.datoY == 0) {
      this.estado = 3;
      return;
    }

    this.lstX.push(this.datoX);
    this.lstY.push(this.datoY);
    this.datoX = undefined;
    this.datoY = undefined;
    this.estado = undefined;
    form.reset();
  }

  // iniciamos el modo reemplazar para usar el formulario para editar los datoss
  onClickReemplazarCancelar(form) {
    this.resetFormCalibrar(form);
    this.reemplazar = false;
  }

  //reemplazamos el punto viejo por el nuevo
  onClickReemplazar(form) {
    this.lstX[this.reemplazarIndex] = this.datoX;
    this.lstY[this.reemplazarIndex] = this.datoY;
    this.reemplazar = false;
    this.resetFormCalibrar(form);
  }

  //reseteamos el formulario de calibrar
  resetFormCalibrar(form) {
    form.reset();
    this.datoX = undefined;
    this.datoY = undefined;
  }

  //registramos la informacion del formulario calibrar
  calibrarSubmit(form) {

    this.estructura.x = this.lstX;
    this.estructura.y = this.lstY;

    this.spinnerService.show();

    this.estructuraControlService.calibrar(this.estructura).subscribe(res => {

      this.resetVariables();
      this.estado = 1;
      this.calibrar = false;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

  }

  onSelectedEstructuraGraficar(selected: CompleterItem) {


    if (selected) {

      //mostramos la grafica
      this.graficar = true;

      //tomamos los valores de la ecuacion
      this.a = selected.originalObject.coeficiente;
      this.b = selected.originalObject.exponente;
      let y: number[] = [];

      //decimos si hay ecuacion o no
      this.ecuacion = this.a == null || this.b == null ? false : true;


      //calculamos los valores para graficarlos
      for (let i = 0; i <= 600; i += 50) {

        let p = this.a * Math.pow(i, this.b);
        y.push(p);

      }
      //calculamos los valores para graficarlos
      for (let i = 0; i <= 600; i += 50) {

        let p = this.a * Math.pow(i, this.b);
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
              ],
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: 'Curva de calibración'
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Caudal (L/s)'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Tirante de agua (m)'
              }
            }],
          }
        }
      });

    }

  }

  onKeyUpGraficar() {
    this.graficar = false;
    this.ecuacion = false;
    if (this.chart) {
      this.chart.destroy();
    }
  }

  resetVariables() {
    this.estructura = new EstructuraControl();
    this.datoX = undefined;
    this.datoY = undefined;
    this.lstX = [];
    this.lstY = [];
    this.calibrar = false;
    this.estructuraCompleter = '';
    this.canalCompleter = '';
    this.graficar = false;
  }
}
