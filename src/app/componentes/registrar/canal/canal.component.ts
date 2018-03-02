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
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { CanalObra } from '../../../_model/canal-obra';
import { ObraService } from '../../../_service/obra.service';

@Component({
  selector: 'app-canal',
  templateUrl: './canal.component.html',
  styleUrls: ['./canal.component.css']
})
export class CanalComponent {

  //objeto para manejar los tabs
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  //Objeto donde se almacenaran los datos a registrar
  public canal: Canal;
  //lista de unidades para los select en cascada de ubicacion y categoria del canal
  public lstUnidad: Unidad[];
  //lsita de zonas para la ubicacion del canal
  public lstZona: Zona[];
  //lista de secciones para la ubcacion del canal
  public lstSeccion: Seccion[];
  //lista de obras utilizado en el select 
  public lstObra: Obra[];
  //
  public lstCanalObra: CanalObra[];
  //Las secciones seleccionadas se van almacenado en este array 
  public lstSeccionCanal: SeccionCanal[];
  //Se almacenan los nombres de las unidades, zonas y secciones
  public lstUbicacionCanal: string[];
  //se guarda el valor seleccionado en la ubicacion
  public unidadId: number;
  //se guarda el valor seleccionado en la ubicacion
  public zonaId: number;
  //se guarda el valor seleccionado en la ubicacion
  public seccionId: number;
  //se guarda un valor numerico para mostrar un mensaje al usuario
  public estatus: number;
  //Se guardara el canal seleccionado en el auto-completer
  private canalId: Canal;
  //se guarda el nombre de la obra para despues pasarlo al array
  public idObra: number;
  //se almacena la descripcion del canal para depues pasarlo al array
  public obraDescripcion: string;
  // auto-completer
  public searchCanal;
  public dataServiceCanal: CompleterData;

  public disabledObras: boolean;


  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private canalService: CanalService,
    private completerService: CompleterService,
    private obraService: ObraService
  ) {

    this.spinnerService.show();

    //inicializamos el auto-completer
    canalService.listar().subscribe(res => {
      this.dataServiceCanal = this.completerService.local(res, 'nombre,codigo', 'nombre');
      spinnerService.hide();
    });

    //inicializamos la lista para no tener problemas con los select
    this.lstUnidad = [];
    this.lstObra = [];
    //Consultamos las unidades para llenar el select unidades
    this.unidadService.listarTodos().subscribe(res => {
      this.spinnerService.hide();

      this.lstUnidad = res;

    }, err => {
      this.spinnerService.hide();
    });

    this.obraService.listar().subscribe(res => {
      this.lstObra = res;
    });

    this.resetVariables();
  }

  //evento del auto-completer
  onCanalSelect(selected: CompleterItem) {
    if (selected) {
      this.canalId = new Canal();
      this.canalId.id = selected.originalObject.id;
    }
    this.categoriaChange();
  }

  /* 
  //necesario para los select de ubicacion puedan tener el valor por defecto "-- Seleccione --"
  compareFn(optionOne, optionTwo): boolean {
    console.log(optionOne); console.log(optionTwo);

    let res: boolean;

    if (optionTwo != null) {
      res = optionOne.id === optionTwo.id;
    } else {
      res = optionOne === -1;
    }

    return res;
  }
*/
  unidadChange() {

    //limpiamos posibles valores anteriores
    this.seccionId = -1;
    this.zonaId = -1;
    this.lstSeccion = [];
    this.lstZona = [];

    if (this.unidadId == -1) return;

    this.spinnerService.show();

    let u: Unidad = this.lstUnidad[this.unidadId];

    this.zonaService.buscarPorUnidadId(u.id).subscribe(res => {
      this.spinnerService.hide();
      this.lstZona = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  zonaChange() {

    //limpiamos posibles valores anteriores
    this.lstSeccion = [];
    this.seccionId = -1;

    if (this.zonaId == -1) return;

    this.spinnerService.show();

    let z = this.lstZona[this.zonaId];

    this.seccionService.buscarPorZonaId(z.id).subscribe(res => {
      this.spinnerService.hide();
      this.lstSeccion = res;
    }, err => {
      this.spinnerService.hide();
    });
  }

  agregarObra() {

    if (this.idObra < 0) return;

    if (this.obraDescripcion.trim() == '') {
      this.estatus = 4;
      this.resetEstatus();
      return;
    }

    //Declaramos los objetos para 
    let co: CanalObra = new CanalObra();
    let o: Obra = new Obra();

    //Obtenemos la obra seleccionada de la lista
    let obraLista = this.lstObra[this.idObra];

    //Llevamos los datos al objeto nuevo para la lista
    o.id = obraLista.id;
    o.nombre = obraLista.nombre;
    co.descripcion = this.obraDescripcion;
    co.obraId = o;

    this.lstCanalObra.push(co);

    this.idObra = -1;
    this.obraDescripcion = '';
  }

  eliminarObra(index: number) {
    this.lstCanalObra.splice(index, 1);
  }

  registrar(form) {

    this.spinnerService.show();

    this.canalService.existeCanalPorCodigo(this.canal.codigo).subscribe(res => {

      if (res.existe) {
        this.estatus = 2;
        this.resetEstatus();
        this.spinnerService.hide();
      } else {

        this.canal.lstSeccionCanal = this.lstSeccionCanal;
        this.canal.lstCanalObra = this.lstCanalObra;

        if (this.canalId != null) this.canal.canalId = this.canalId;

        this.canalService.registrar(this.canal).subscribe(res => {
          this.spinnerService.hide();

          if (res.id != null) {
            this.estatus = 1;
            this.staticTabs.tabs[0].active = true;
            form.reset();
            this.resetVariables();
            this.resetEstatus();
          } else {
            this.estatus = 0;
            this.resetEstatus();
          }
        }, err => {
          this.spinnerService.hide();
        })
      }
    }, err => {
      this.estatus = 0;
      this.resetEstatus();
      this.spinnerService.hide();
    });
  }

  agregarSeccion() {

    //verificamos que los datos sean correctos
    if (this.seccionId == -1 || this.zonaId == -1 || this.unidadId == -1) return;

    let s = this.lstSeccion[this.seccionId];

    //verificamos que la seccion a agregar no este en la lista
    for (let u of this.lstSeccionCanal) {
      if (u.seccionId.id == s.id) {

        this.estatus = 3;
        this.resetEstatus();
        return;
      }
    }

    //Armamos el objeto para adicionarlo a la lista
    let seccionCanal = new SeccionCanal();
    let seccion = new Seccion();
    seccion.id = s.id;
    seccionCanal.seccionId = seccion;

    this.lstSeccionCanal.push(seccionCanal);

    let z = this.lstZona[this.zonaId];
    let u = this.lstUnidad[this.unidadId];

    //Armamos el string para mostrarlo en la lista al usuairo
    let ubicacion = u.nombre + ' - ' + z.nombre + ' - ' + s.nombre;

    this.lstUbicacionCanal.push(ubicacion);

    //reseteamos los selects
    this.zonaId = -1;
    this.seccionId = -1;
    this.unidadId = -1;

    //reseteamos las listas
    this.lstZona = [];
    this.lstSeccion = [];
  }

  eliminarUbicacion(index: number) {
    this.lstSeccionCanal.splice(index, 1);
    this.lstUbicacionCanal.splice(index, 1);
  }

  // quitara el mensaje al usuario despues de 5 segundos
  resetEstatus() {
    setTimeout(() => this.estatus = -1, 5000);
  }

  //necesario para bloquear o desbloquear el tab de obras
  categoriaChange() {

    if(this.canal.categoria == '') this.disabledObras = true;

    if (this.canal.categoria == 'CANAL_ADUCCION' || this.canal.categoria == 'CANAL_PRINCIPAL') {
      this.disabledObras = false;
    } else {
      
      if(this.canalId == null || this.searchCanal == '') {
        this.disabledObras = true;
      } else {
        this.disabledObras = false;
      }
    }
  }

  private resetVariables() {
    this.canal = new Canal();
    this.canal.codigo = '';
    this.canal.categoria = '';
    this.canal.seccionTipica = '';
    this.canal.tipo = '';
    this.canal.estado = '';
    this.canal.clase = '';
    this.lstZona = [];
    this.lstSeccion = [];
    this.unidadId = -1;
    this.zonaId = -1;
    this.seccionId = -1;
    this.lstUbicacionCanal = [];
    this.lstSeccionCanal = [];
    this.lstSeccionCanal = [];
    this.lstUbicacionCanal = [];
    this.lstCanalObra = [];
    this.obraDescripcion = '';
    this.idObra = -1;
    this.canalId = null;
    this.searchCanal = '';
    this.disabledObras = true;
  }


}
