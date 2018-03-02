import { Component, ViewChild } from '@angular/core';
import { Canal } from '../../../_model/canal';
import { CanalService } from '../../../_service/canal.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Predio } from '../../../_model/predio';
import { PredioService } from '../../../_service/predio.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-predio',
  templateUrl: './predio.component.html',
  styleUrls: ['./predio.component.css']
})
export class PredioComponent {

  //guarda el valor del select canal
  public canalId: Canal;
  //---------------------------- listas para los select
  public lstCanal: Canal[];
  //----------------------------
  public predio: Predio;
  //guardara valoes para mostrar mensajes al usuario
  public estado: number;
  // auto-completer
  public searchCanal;
  public dataServiceCanal: CompleterData;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private predioService: PredioService,
    private completerService: CompleterService
  ) {
    this.resetVariables();

    this.lstCanal = [];

    canalService.listar().subscribe(res => {
      this.dataServiceCanal = this.completerService.local(res, 'nombre,codigo', 'nombre');
    });
  }

  //evento del auto-completer
  onCanalSelect(selected: CompleterItem) {
    if(selected) {
      this.canalId = new Canal();
      this.canalId.id = selected.originalObject.id;
    }
  }

  registrar(form) {

    if(this.searchCanal == '') {
      this.estado = 3;
    }

    this.predio.canalId = this.canalId;

    this.spinnerService.show();

    this.predioService.existePorCodigo(this.predio.codigo).subscribe(res => {

      if(res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }
      this.predioService.registrar(this.predio).subscribe(res => {

        this.spinnerService.hide();
  
        if (res.id != 0) {
          this.estado = 1;
          form.reset();
          this.resetVariables();
        } else {
          this.estado = 0;
        }
  
      }, err => this.spinnerService.hide());
    })
  }

  resetVariables(): void {
    this.predio = new Predio();
    this.canalId = new Canal();
    this.canalId.id = -1;
    this.searchCanal = '';
  }

}
