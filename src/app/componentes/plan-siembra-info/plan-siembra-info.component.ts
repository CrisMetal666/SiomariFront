import { Component } from '@angular/core';
import { CultivoPredioService } from '../../_service/cultivo-predio.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UnidadService } from '../../_service/unidad.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-plan-siembra-info',
  templateUrl: './plan-siembra-info.component.html',
  styleUrls: ['./plan-siembra-info.component.css']
})
export class PlanSiembraInfoComponent {

  //lista con la informacion que se mostrara al usuario al momento que den la orden de buscar
  public lstPlaneacionInfo: any[][] = [];
  //dependiendo del valor numerico se mostrara un mensaje al usuario
  public estado: number;
  public year: number;
  public campania: string;
  //ayudara a controlar el mensaje al usuario cuando no haya informacion
  public consultado: boolean;
  // id de la unidad seleeccionada
  idUnidad: number;
  //se guardaran las unidades para el autocompleter
  public dataServiceUnidad: CompleterData;
  
  constructor(
    private cultivoPredioService: CultivoPredioService,
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private completerService: CompleterService
  ) {
    this.campania = '';
    this.year = new Date().getFullYear();
    this.lstPlaneacionInfo = [];
  }

  ngOnInit() {
    //inicializamos los datos para el autocompleter
    this.spinnerService.show();
    this.unidadService.listarTodos().subscribe(res => {
      this.dataServiceUnidad = this.completerService.local(res, 'nombre', 'nombre');
      this.spinnerService.hide();
    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  onSelectedUnidad(selected: CompleterItem) {
    if (selected) {
      this.idUnidad = selected.originalObject.id;
    } else {
      this.idUnidad = 0;
    }
  }

  consultar() {

    this.spinnerService.show();

    this.cultivoPredioService.planeacionInfoDemanda(this.year, this.campania, this.idUnidad).subscribe(res => {

      this.lstPlaneacionInfo = res;
      this.consultado = true;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

}
