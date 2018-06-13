import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Predio } from '../../_model/predio';
import { PredioService } from '../../_service/predio.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-consulta-predio',
  templateUrl: './consulta-predio.component.html',
  styleUrls: ['./consulta-predio.component.css']
})
export class ConsultaPredioComponent implements OnInit {

  //autocompleter
  public dataServicePredio: CompleterData;
  //objeto donde se almacenara la informacion a mostar
  predio: Predio;
  // mostrara si hay un error durante la consulta
  estado: number;
  //mostrara o ocultara el formulario que muesta la informacion
  consultado: boolean;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private predioService: PredioService,
    private completerService: CompleterService,
  ) { }

  ngOnInit() {
    this.dataServicePredio = this.completerService.remote(this.predioService.urlBuscarIdCodigoNombrePorNombreOCodigo, 'nombre,codigo', 'nombre');
  }

  //evento del auto-completer
  onPredioSelect(selected: CompleterItem) {

    if (selected) {

      this.spinnerService.show();

      //traemos toda la informacion del predio seleccionado
      this.predioService.buscarPorId(selected.originalObject.id).subscribe(res => {

        //le asignamos el valor consultado para que sea mostrado en el formulario
        this.predio = res;
        //limpiamos cualquier posible mensaje
        this.estado = undefined;

        //mostramos el formulario
        this.consultado = true;

        this.spinnerService.hide(); 

      }, err => {
        this.consultado = false;
        this.estado = 0;
        this.spinnerService.hide();
      });

    }
  }
}
