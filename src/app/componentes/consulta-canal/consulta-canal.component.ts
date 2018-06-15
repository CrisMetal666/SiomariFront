import { Component, OnInit } from '@angular/core';
import { ConsultaCanal } from '../../_model/consulta-canal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CanalService } from '../../_service/canal.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';

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

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private completerService: CompleterService,
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

}
