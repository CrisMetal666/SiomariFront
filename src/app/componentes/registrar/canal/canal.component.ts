import { Component, ViewChild, TemplateRef } from '@angular/core';
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
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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
  // necesario para la georreferenciacion de las obras
  public gLatitud: number;
  // necesario para la georreferenciacion de las obras
  public gLongitud: number;
  // auto-completer
  public searchCanal;
  public dataServiceCanal: CompleterData;
  //estableceremos el valor para bloquear o desbloquear el tab de obras
  public disabledObras: boolean;
  //nos sirve para manejar el modal
  private modalRef: BsModalRef;
  //se usara para el modal de editar obra
  public canalObraEditar: CanalObra;
  //almacenara la posicion de la obra de la lista de obras, para poder modificarla
  public indexCanalObra: number;
  //cuando se vaya a modificar una obra, almacenaremos en esta variable, la posicion
  //de la obra que se quiera modificar
  public indexObraEditar: number;
  //todas las obras que se adicionen a la lista latCanalObra, en este array se almacenara
  //la posicion de la obra que se seleccionaron, para despues poder localizarlo al momento
  //de querer editarlo con el modal
  public lstIndexObra: number[];


  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private canalService: CanalService,
    private completerService: CompleterService,
    private obraService: ObraService,
    private modalService: BsModalService
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

    //verificamos que hayan agregado la descripcion
    if (this.obraDescripcion.trim() == '') {
      this.estatus = 4;
      this.resetEstatus();
      return;
    }

    //Declaramos los objetos para no modificar los objetos originales
    let co: CanalObra = new CanalObra();
    let o: Obra = new Obra();

    //Obtenemos la obra seleccionada de la lista
    let obraLista = this.lstObra[this.idObra];

    //Llevamos los datos al objeto nuevo para la lista
    o.id = obraLista.id;
    o.nombre = obraLista.nombre;
    co.descripcion = this.obraDescripcion;
    co.obraId = o;
    co.latitud = this.gLatitud;
    co.longitud = this.gLongitud;

    this.lstCanalObra.push(co);
    //establecemos el index de la obra seleccionada para despues poder usarlo en el modal
    this.lstIndexObra.push(this.idObra);

    this.idObra = -1;
    this.obraDescripcion = '';
    this.gLatitud = undefined;
    this.gLongitud = undefined;
  }

  eliminarObra(index: number) {
    this.lstCanalObra.splice(index, 1);
    this.lstIndexObra.splice(index, 1);
  }

  editarObra(template: TemplateRef<any>) {

    //obtenemos la obra seleccionada
    let obraLista = this.lstObra[this.indexObraEditar];

    //creamos un objeto nuevo para no modificar los objetos originales
    let o: Obra = new Obra();
    o.id = obraLista.id;
    o.nombre = obraLista.nombre;

    this.canalObraEditar.obraId = o;
    
    //reemplazamos el objeto viejo por el nuevo
    this.lstCanalObra[this.indexCanalObra] = this.canalObraEditar;
    //como reemplazamos el objeto debemos reemplazar el index de la obra seleccionada
    //en la lista de indices
    this.lstIndexObra[this.indexCanalObra] = this.indexObraEditar;


    this.canalObraEditar = new CanalObra();
    this.modalRef.hide();
  }

  openModalEditar(template: TemplateRef<any>, index: number) {
    //establesco el indice de la lista el cual se va a modificar
    this.indexCanalObra = index;
    //establesco la obra que se selecciono en index seleccionado
    this.indexObraEditar = this.lstIndexObra[index];
    //llenamos el objeto que se usara en el modal para modificarlo
    this.canalObraEditar = this.lstCanalObra[index];
    //mostramos el modal
    this.modalRef = this.modalService.show(template);
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
            // volvemos a llenar la lista para el auto-completer
            this.canalService.listar().subscribe(res => {
              this.dataServiceCanal = this.completerService.local(res, 'nombre,codigo', 'nombre');
            });
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

    if (this.canal.categoria == '') this.disabledObras = true;

    if (this.canal.categoria == 'CANAL_ADUCCION' || this.canal.categoria == 'CANAL_PRINCIPAL') {
      this.disabledObras = false;
    } else {

      if (this.canalId == null || this.searchCanal == '') {
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
    this.gLatitud = undefined;
    this.gLatitud = undefined;
    this.canalObraEditar = new CanalObra();
    this.lstIndexObra = [];
  }


}
