import { Component, OnInit } from '@angular/core';
import { ClimatologiaDatos } from '../../_model/climatologia-datos';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { ClimatologiaDatosService } from '../../_service/climatologia-datos.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ClimatologiaYear } from '../../_model/climatologia-year';
import { ClimatologiaYearService } from '../../_service/climatologia-year.service';

@Component({
  selector: 'app-climatologia',
  templateUrl: './climatologia.component.html',
  styleUrls: ['./climatologia.component.css']
})
export class ClimatologiaComponent implements OnInit {

  //modelo donde se guarda los datos a registrar
  public climatologiaDatos: ClimatologiaDatos;
  //año en el cual se va a registrar los datos
  public year: number;
  //mes en el que se registrara los datos
  public mes: number;
  //se guardara el estado para mostrar al usuario
  public estado: number;
  //auto-completer
  public searchMes: string;
  public dataServiceMes: CompleterData;
  public meses: any[] = [
    { index: 1, mes: "Enero" },
    { index: 2, mes: "Febrero" },
    { index: 3, mes: "Marzo" },
    { index: 4, mes: "Abril" },
    { index: 5, mes: "Mayo" },
    { index: 6, mes: "Junio" },
    { index: 7, mes: "Julio" },
    { index: 8, mes: "Agosto" },
    { index: 9, mes: "Septiembre" },
    { index: 10, mes: "Octubre" },
    { index: 11, mes: "Noviembre" },
    { index: 12, mes: "Diciembre" }
  ];

  constructor(
    private completerService: CompleterService,
    private climatologiaDatosService: ClimatologiaDatosService,
    private spinnerService: Ng4LoadingSpinnerService,
    private climatologiaYearService: ClimatologiaYearService
  ) {
    this.year = new Date().getFullYear();
    this.dataServiceMes = this.completerService.local(this.meses, 'mes,index', 'mes');
  }

  ngOnInit() {
    this.resetVariables();
  }

  //evento selected del auto-completer
  onMesSelect(selected: CompleterItem) {

    this.resetVariables();

    if (selected) {
      this.mes = selected.originalObject.index;

      this.spinnerService.show();

      this.climatologiaDatosService.datosPorMesYYear(this.mes, this.year).subscribe(res => {

        this.spinnerService.hide();

        if (res.id != 0) {
          this.climatologiaDatos = res;
        }

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
    } else {
      this.mes = 0;
    }
  }

  //evento ngsubmit. Guardara los datos
  registrar(form) {

    this.spinnerService.show();

    /*
    * buscamos si ya tenia datos registrados para no sobre escribir la informacion y borrarla
    * ya que si no se consultan, los demas meses que no se vayan a registrar en este momento
    * quedaran nulos
    */
    this.climatologiaYearService.buscarPorId(this.year).subscribe(res => {

      let climatologiaYear: ClimatologiaYear = res;

      if (this.mes == 1) {
        climatologiaYear.enero = this.climatologiaDatos;
      } else if (this.mes == 2) {
        climatologiaYear.febrero = this.climatologiaDatos;
      } else if (this.mes == 3) {
        climatologiaYear.marzo = this.climatologiaDatos;
      } else if (this.mes == 4) {
        climatologiaYear.abril = this.climatologiaDatos;
      } else if (this.mes == 5) {
        climatologiaYear.mayo = this.climatologiaDatos;
      } else if (this.mes == 6) {
        climatologiaYear.junio = this.climatologiaDatos;
      } else if (this.mes == 7) {
        climatologiaYear.julio = this.climatologiaDatos;
      } else if (this.mes == 8) {
        climatologiaYear.agosto = this.climatologiaDatos;
      } else if (this.mes == 9) {
        climatologiaYear.septiembre = this.climatologiaDatos;
      } else if (this.mes == 10) {
        climatologiaYear.octubre = this.climatologiaDatos;
      } else if (this.mes == 11) {
        climatologiaYear.noviembre = this.climatologiaDatos;
      } else if (this.mes == 12) {
        climatologiaYear.diciembre = this.climatologiaDatos;
      } else {
        this.estado = 0;
        this.spinnerService.hide();
        return;
      }

      if(climatologiaYear.year == 0) {
        climatologiaYear.year = this.year;
      }

      this.climatologiaYearService.guardar(climatologiaYear).subscribe(res => {

        this.spinnerService.hide();
        this.estado = 1;
        this.resetVariables();
        form.reset();
        

      }, err => {
        this.spinnerService.hide();
        this.estado = 0;
      });

    }, err => {
      this.spinnerService.hide();
      this.estado = 0;
    });

  }

  //inicializamos las variables
  resetVariables() {
    this.climatologiaDatos = new ClimatologiaDatos();
    this.mes = undefined; 
  }
} 
