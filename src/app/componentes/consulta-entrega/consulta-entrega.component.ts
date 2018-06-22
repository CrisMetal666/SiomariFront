import { Component, OnInit } from '@angular/core';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { EntregaService } from '../../_service/entrega.service';
import { PredioService } from '../../_service/predio.service';
import { Predio } from '../../_model/predio';
import { EntregaInfo } from '../../_model/entrega-info';
import { Facturacion } from '../../_model/facturacion';

@Component({
  selector: 'app-consulta-entrega',
  templateUrl: './consulta-entrega.component.html',
  styleUrls: ['./consulta-entrega.component.css']
})
export class ConsultaEntregaComponent implements OnInit {

  //auto-completer
  public searchPredio: string;
  public dataServicePredio: CompleterData;
  public predio: Predio; //guardaremos el id del predio y validador para el formulario
  //rango de fechas
  public rango: Date[];
  //segun el valor mostrara un mensaje al usuaruio
  public estado: number;
  //caudal entregado
  public facturacion: Facturacion;
  public total: EntregaInfo;
  public lstCaudal: EntregaInfo[];
  public nombrePredio: string;
  public nombreUsuario: string;

  constructor(
    private completerService: CompleterService,
    private predioService: PredioService,
    private entregaService: EntregaService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.total = new EntregaInfo();
    this.lstCaudal = [];
  }

  ngOnInit() {
    //inicializamos los autocompleter
    this.dataServicePredio = this.completerService.remote(this.predioService.urlBuscarIdCodigoNombrePorNombreOCodigo, 'codigo,nombre', 'nombre');
  }

  onPredioSelect(selected: CompleterItem) {

    this.predio = null;

    if (selected) {
      this.predio = new Predio();
      this.predio.id = selected.originalObject.id;
    }
  }

  consultar() {

    //convertimos la fecha a un string
    let fecha1: string = this.getYearMesDia(this.rango[0]);
    let fecha2: string = this.getYearMesDia(this.rango[1]);

    this.spinnerService.show();

    this.entregaService.caudalServidoPorRangoFecha(fecha1, fecha2, this.predio.id).subscribe(res => {

      //obtenemos el tamaño de la lista
      let size: number = res.lstEntregaInfo.length;

      if (size != 0) {

        //asignamos el ultimo elemento para poder mostrarlo adecuadamente en la tabla
        this.total = res.lstEntregaInfo[size - 1];

        // dejamos por fuera el ultimo elemento de la lista ya que es el total
        this.lstCaudal = res.lstEntregaInfo.splice(0, size - 1);

        

        this.nombrePredio = res.nombrePredio;
        this.nombreUsuario = res.nombreUsuario;

        // decimos que todo esta ok y mostramos el resultado
        this.estado = 1;

      } else {
        this.estado = 2;
      }

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

  }

  /**
   * se devuleve la fecha en formato yyyy-mm-dd
   * @param fecha fecha a parcear
   * @return fecha en texto
   */
  private getYearMesDia(fecha: Date): string {

    let dia: number = fecha.getDate();
    let mes: number = fecha.getMonth() + 1;
    let diaString: string = dia < 10 ? '0' + dia : '' + dia;
    let mesString: string = mes < 10 ? '0' + mes : '' + mes;

    return `${fecha.getFullYear()}-${mesString}-${diaString}`;
  }

}

