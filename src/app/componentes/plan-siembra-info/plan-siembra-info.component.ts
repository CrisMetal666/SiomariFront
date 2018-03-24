import { Component, OnInit } from '@angular/core';
import { CultivoPredioService } from '../../_service/cultivo-predio.service';
import { PlaneacionInfo } from '../../_model/planeacion-info';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { CultivoService } from '../../_service/cultivo.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-plan-siembra-info',
  templateUrl: './plan-siembra-info.component.html',
  styleUrls: ['./plan-siembra-info.component.css']
})
export class PlanSiembraInfoComponent implements OnInit {

  //lista con la informacion que se mostrara al usuario al momento que den la orden de buscar
  public lstPlaneacionInfo: PlaneacionInfo[] = [];
  //autocompleter
  public searchCultivo: string;
  public dataServiceCultivo: CompleterData;
  //dependiendo del valor numerico se mostrara un mensaje al usuario
  public estado: number;
  //id del cultivo seleccionado
  private cultivoId: number;
  public year: number;
  public campania: string;

  constructor(
    private cultivoPredioService: CultivoPredioService,
    private completerService: CompleterService,
    private cultivoService: CultivoService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.cultivoId = 0;
    this.campania = ''; 
    this.year = new Date().getFullYear();
  }

  ngOnInit() {
    //inicializamos el autocompleter
    this.dataServiceCultivo = this.completerService.remote(this.cultivoService.urlBuscarIdNombrePorNombre, 'nombre', 'nombre');
  }

  onCultivoSelect(selected: CompleterItem) {
    if (selected) {
      this.cultivoId = selected.originalObject.id;
    } else {
      this.cultivoId = 0;
    }
  }

  consultar() {

    this.spinnerService.show();

    this.cultivoPredioService.planeacionInfo(this.cultivoId, this.year, this.campania).subscribe(res => {

      this.lstPlaneacionInfo = res;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

}
