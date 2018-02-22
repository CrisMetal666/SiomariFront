import { Component, ViewChild } from '@angular/core';
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
import { SeccionCanal } from '../../../_model/seccion-canal';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-canal',
  templateUrl: './canal.component.html',
  styleUrls: ['./canal.component.css']
})
export class CanalComponent {

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public canal: Canal;
  public lstUnidad: Unidad[];
  public lstZona: Zona[];
  public lstSeccion: Seccion[];
  public lstObra: Obra[];
  public lstSeccionCanal: SeccionCanal[];
  public lstUbicacionCanal: string[];
  public unidadId: Unidad;
  public zonaId: Zona;
  public seccionId: Seccion;
  public estatus: number;
  public obraNombre: string;
  public unidad2;
  public zona2;
  public seccion2;
  public canal2;
  public lstZona2: Zona[];
  public lstSeccion2: Seccion[];
  public lstCanal2: Canal[];

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private canalService: CanalService
  ) {
    this.spinnerService.show();

    this.lstUnidad = [];

    this.unidadService.listarTodos().subscribe(res => {
      this.spinnerService.hide();

      this.lstUnidad = res;

    }, err => {
      this.spinnerService.hide();
    })

    this.resertVariables();
  }

  compareFn(optionOne, optionTwo): boolean {

    let res: boolean;

    if(optionTwo != null) {
      res = optionOne.id === optionTwo.id;
    }else {
      res = optionOne === -1;
    }

    return res;
  }

  unidadChange() {

    //limpiamos posibles valores anteriores
    this.zonaId.id = -1;
    this.seccionId = new Seccion();
    this.seccionId.id = -1;
    this.zonaId = new Zona();
    this.zonaId.id = -1;
    this.lstSeccion = [];
    this.lstZona = [];

    if (this.unidadId.id <= 0) return;

    this.spinnerService.show();

    this.zonaService.buscarPorUnidadId(this.unidadId.id).subscribe(res => {
      this.spinnerService.hide();
      this.lstZona = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  unidadDosChange() {

    //limpiamos posibles valores anteriores
    this.zona2 = '';
    this.seccion2 = '';
    this.canal2 = '';
    this.lstSeccion2 = [];
    this.lstZona2 = [];
    this.lstCanal2 = [];

    if(this.unidad2 == '' || this.unidad2 <= 0) return;

    this.spinnerService.show();

    this.zonaService.buscarPorUnidadId(this.unidad2).subscribe(res => {
      this.spinnerService.hide();
      this.lstZona2 = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  zonaChange() {

    //limpiamos posibles valores anteriores
    this.lstSeccion = [];
    this.seccionId = new Seccion();
    this.seccionId.id = -1;

    if (this.zonaId.id <= 0) return;

    this.spinnerService.show();

    this.seccionService.buscarPorZonaId(this.zonaId.id).subscribe(res => {
      this.spinnerService.hide();
      this.lstSeccion = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  zonaDosChange() {

    //limpiamos posibles valores anteriores
    this.seccion2 = '';
    this.canal2 = '';
    this.lstSeccion2 = [];
    this.lstCanal2 = [];

    if(this.zona2 == '' || this.zona2 <= 0) return;

    this.spinnerService.show();

    this.seccionService.buscarPorZonaId(this.zona2).subscribe(res => {
      this.spinnerService.hide();
      this.lstSeccion2 = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  seccionDosChange() {

    //limpiamos posibles valores anteriores
    this.canal2 = '';
    this.lstCanal2 = [];

    if(this.seccion2 == '' || this.seccion2 <= 0) return;

    this.spinnerService.show();

    this.canalService.buscarPorSeccionId(this.seccion2).subscribe(res => {
      this.spinnerService.hide();
      this.lstCanal2 = res;
    }, err => {
      this.spinnerService.hide();
    });
  }
  
  agregarObra() {

    if (this.obraNombre.trim().length == 0) return;

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

      if (res.existe) {
        this.estatus = 2;
        this.spinnerService.hide();
      } else {
        this.canal.lstObra = this.lstObra;
        this.canal.lstSeccionCanal = this.lstSeccionCanal;

        if(this.canal2 > 0) {
          let c: Canal = new Canal();
          c.id = this.canal2;
          this.canal.canalId = c;
        }

        this.canalService.registrar(this.canal).subscribe(res => {
          this.spinnerService.hide();

          if (res.id != null) {
            this.estatus = 1;
            form.reset();
            this.resertVariables();
            this.staticTabs.tabs[0].active = true;
          } else {
            this.estatus = 0;
          }
        }, err => {
          this.spinnerService.hide();
        })
      }
    }, err => {
      this.estatus = 0;
      this.spinnerService.hide();
    });
  }

  agregarSeccion() {

    //verificamos que los datos sean correctos
    if (this.seccionId.id <= 0 || this.zonaId.id <= 0 || this.unidadId.id <= 0) return;
    if (this.seccionId.id == undefined || this.zonaId.id == undefined || this.unidadId.id == undefined) return;

    //verificamos que la seccion a agregar no este en la lista
    for (let u of this.lstSeccionCanal) {
      if (u.seccionId.id == this.seccionId.id) {

        this.estatus = 3;  
        setTimeout(() => {
          this.estatus = -1;                                                                               
        }, 5000);

        return;
      }
    }

    //Armamos el objeto para adicionarlo a la lista
    let seccionCanal = new SeccionCanal();
    let seccion = new Seccion();
    seccion.id = this.seccionId.id;
    seccionCanal.seccionId = seccion;

    this.lstSeccionCanal.push(seccionCanal);

    //Armamos el string para mostrarlo en la lista al usuairo
    let ubicacion = this.unidadId.nombre + ' - ' + this.zonaId.nombre + ' - ' + this.seccionId.nombre;

    this.lstUbicacionCanal.push(ubicacion);

    //reseteamos los selects
    this.unidadId = new Unidad();
    this.zonaId = new Zona();
    this.seccionId = new Seccion();
    this.zonaId.id = -1;
    this.seccionId.id = -1;
    this.unidadId.id = -1;

    //reseteamos las listas
    this.lstZona = [];
    this.lstSeccion = [];

  }

  eliminarUbicacion(index: number) {
    this.lstSeccionCanal.splice(index, 1);
    this.lstUbicacionCanal.splice(index, 1);
  }

  private resertVariables() {
    this.canal = new Canal();
    this.canal.codigo = '';
    this.canal.categoria = '';
    this.canal.seccionTipica = '';
    this.canal.tipo = '';
    this.canal.estado = '';
    this.canal.clase = '';
    this.lstZona = [];
    this.lstSeccion = [];
    this.lstObra = [];
    this.unidadId = new Unidad();
    this.unidadId.id = -1;
    this.unidadId.nombre = '-- Seleccione --';
    this.zonaId = new Zona();
    this.zonaId.id = -1;
    this.zonaId.nombre = '-- Seleccione --';
    this.seccionId = new Seccion();
    this.seccionId.id = -1;
    this.seccionId.nombre = '-- Seleccione --';
    this.obraNombre = '';
    this.lstUbicacionCanal = [];
    this.lstSeccionCanal = [];
    this.unidad2 = '';
    this.zona2 = '';
    this.seccion2 = '';
    this.canal2 = '';
    this.lstSeccion2 = [];
    this.lstCanal2 = [];
    this.lstZona2 = [];
    this.lstSeccionCanal = [];
    this.lstUbicacionCanal = [];
  }


}
