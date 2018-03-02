import { Component } from '@angular/core';
import { Seccion } from '../../../_model/seccion';
import { Zona } from '../../../_model/zona';
import { UnidadService } from '../../../_service/unidad.service';
import { ZonaService } from '../../../_service/zona.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Unidad } from '../../../_model/unidad';
import { SeccionService } from '../../../_service/seccion.service';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css']
})
export class SeccionComponent {

  seccion: Seccion;
  unidadId: number;
  estado: number;
  lstUnidad: Unidad[] = [];
  lstZona: Zona[] = [];

  constructor(
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private spinnerService: Ng4LoadingSpinnerService,
    private seccionService: SeccionService
  ) {
    this.resetVariables();
    this.spinnerService.show();

    unidadService.listarTodos().subscribe(res => {
      this.spinnerService.hide();
      this.lstUnidad = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  unidadChange() {

    //limpiamos posibles valores anteriores
    this.seccion.zonaId.id = -1;
    this.lstZona = [];

    if (this.unidadId <= 0) return;

    this.spinnerService.show();

    this.zonaService.buscarPorUnidadId(this.unidadId).subscribe(res => {
      this.spinnerService.hide();
      this.lstZona = res;
    }, err => {
      this.spinnerService.hide();
    });

  }

  registrar(form) {

    this.spinnerService.show();

    this.seccionService.existePorNombreYZona(this.seccion.nombre, this.seccion.zonaId.id).subscribe(res => {

      if (res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      this.seccionService.registrar(this.seccion).subscribe((res: Seccion) => {
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
    this.seccion = new Seccion();
    this.seccion.zonaId = new Zona();
    this.seccion.zonaId.id = -1;
    this.unidadId = -1;
    this.lstZona = [];
  }

}
