import { Component } from '@angular/core';
import { Canal } from '../../../_model/canal';
import { Unidad } from '../../../_model/unidad';
import { Zona } from '../../../_model/zona';
import { Seccion } from '../../../_model/seccion';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UnidadService } from '../../../_service/unidad.service';
import { ZonaService } from '../../../_service/zona.service';
import { SeccionService } from '../../../_service/seccion.service';
import { CanalService } from '../../../_service/canal.service';
import { Obra } from '../../../_model/obra';

@Component({
  selector: 'app-canal',
  templateUrl: './canal.component.html',
  styleUrls: ['./canal.component.css']
})
export class CanalComponent {

  canal: Canal;
  lstUnidad: Unidad[];
  lstZona: Zona[];
  lstSeccion: Seccion[];
  lstObra: Obra[];
  unidadId: number;
  zonaId: number;
  estado: number;
  obraNombre: string;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private canalService: CanalService
  ) { 
    this.spinnerService.show();

    this.unidadService.listarTodos().subscribe(res => {
      this.spinnerService.hide();
      this.lstUnidad = res;
    }, err => {
      this.spinnerService.hide();
    })

    this.resertVariables();
  }

  unidadChange() {

    //limpiamos posibles valores anteriores
    this.zonaId = -1;
    this.canal.seccionId.id = -1;
    this.lstSeccion = [];
    this.lstZona = [];

    if(this.unidadId <= 0) return;

    this.spinnerService.show();

    this.zonaService.buscarPorUnidadId(this.unidadId).subscribe(res => {
      this.spinnerService.hide();
      this.lstZona = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  zonaChange() {

    //limpiamos posibles valores anteriores
    this.canal.seccionId.id = -1;
    this.lstSeccion = [];

    if(this.zonaId <= 0) return;

    this.spinnerService.show();

    this.seccionService.buscarPorZonaId(this.zonaId).subscribe(res => {
      this.spinnerService.hide();
      this.lstSeccion = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  agregarObra() {

    if(this.obraNombre.trim().length == 0) return;

    let obra = new Obra();
    obra.nombre = this.obraNombre;

    this.lstObra.push(obra);

    this.obraNombre = '';
  }

  eliminarObra(index: number) {
    this.lstObra.splice(index, 1);
  }

  registrar(form) {

    this.spinnerService.show();

    this.canalService.existeCanalPorCodigo(this.canal.codigo).subscribe(res => {

      if(res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
      } else {
        this.canal.lstObra = this.lstObra;

        this.canalService.registrar(this.canal).subscribe(res => {
          this.spinnerService.hide();

          if(res.id != null) {
            this.estado = 1;
            form.reset();
          } else {
            this.estado = 0;
          }
        }, err => {
          this.spinnerService.hide();
        })
      }
    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  private resertVariables(){
    this.canal = new Canal();
    this.canal.seccionId = new Seccion();
    this.canal.codigo = '';
    this.lstZona = [];
    this.lstSeccion = [];
    this.lstObra = [];
    this.canal.seccionId.id = -1;
    this.unidadId = -1;
    this.zonaId = -1;
    this.obraNombre = '';
  }


}
