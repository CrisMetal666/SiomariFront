import { Component } from '@angular/core';
import { UnidadService } from '../../../_service/unidad.service';
import { Unidad } from '../../../_model/unidad';
import { Zona } from '../../../_model/zona';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ZonaService } from '../../../_service/zona.service';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent {

  lstUnidad: Unidad[];
  zona: Zona;
  estado = -1;

  constructor(
    private unidadService: UnidadService,
    private spinnerService: Ng4LoadingSpinnerService,
    private zonaService: ZonaService
  ) {

    this.spinnerService.show();

    this.unidadService.listarTodos().subscribe(res => {
      this.lstUnidad = res;
      this.spinnerService.hide();
    });

    this.resetVariables();
  }

  registrar(form) {
    this.spinnerService.show();

    this.zonaService.existePorNombreYUnidad(this.zona.nombre, this.zona.unidadId.id).subscribe(res => {

      if (res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      this.zonaService.registrar(this.zona).subscribe((res: Zona) => {

        this.spinnerService.hide();
        if (res.id != 0) {
          this.estado = 1;
          form.reset();
          this.resetVariables();
        } else {
          this.estado = 0;
        }
      }, err => {
        this.spinnerService.hide();
        this.estado = 0;
      });

    });
  }

  private resetVariables() {
    this.zona = new Zona();
    this.zona.unidadId = new Unidad();
    this.zona.unidadId.id = -1;
  }

}
