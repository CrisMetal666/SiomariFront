import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { Canal } from '../../_model/canal';
import { Unidad } from '../../_model/unidad';
import { Zona } from '../../_model/zona';
import { Seccion } from '../../_model/seccion';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { SeccionService } from '../../_service/seccion.service';
import { CanalService } from '../../_service/canal.service';
import { Obra } from '../../_model/obra';
import { SeccionCanal } from '../../_model/seccion-canal';
import { TabsetComponent } from 'ngx-bootstrap';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { CanalObra } from '../../_model/canal-obra';
import { ObraService } from '../../_service/obra.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-canal',
  templateUrl: './canal.component.html',
  styleUrls: ['./canal.component.css']
})
export class CanalComponent implements OnInit {

  //objeto para manejar los tabs
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  //Objeto donde se almacenaran los datos a registrar
  public canal: Canal;
  //lista de obras utilizado en el select 
  public lstObra: Obra[];
  //objeto usado para asignarle las obras al canal
  public lstCanalObra: CanalObra[];
  //Las secciones seleccionadas se van almacenado en este array 
  public lstSeccionCanal: SeccionCanal[];
  //Se almacenan los nombres de las unidades, zonas y secciones
  public lstUbicacionCanal: string[];
  //se guardara la unidad seleeccionada
  public unidadId: Unidad;
  //se guarda la zona seleccionada
  public zonaId: Zona;
  //se guarda la seccion seleccionada
  public seccionId: Seccion;
  //se guarda un valor numerico para mostrar un mensaje al usuario
  public estatus: number;
  //Se guardara el canal seleccionado en el auto-completer
  private canalId: Canal;
  //se guarda el nombre de la obra para despues pasarlo al array
  public idObra: number;
  //se almacena la descripcion del canal para depues pasarlo al array
  public obraDescripcion: string;
  // necesario para la georreferenciacion de las obras
  public gX: number;
  // necesario para la georreferenciacion de las obras
  public gY: number;
  // necesario para la georreferenciacion de las obras
  public gAltitud: number;
  // auto-completer
  public canalCompleter: string;
  public unidadCompleter: string;
  public zonaCompleter: string;
  public seccionCompleter: string;
  public obraCompleter: string;
  public dataServiceCanal: CompleterData;
  public dataServiceUnidad: CompleterData;
  public dataServiceZona: CompleterData;
  public dataServiceSeccion: CompleterData;
  public dataServiceObra: CompleterData;
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
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;


  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private canalService: CanalService,
    private completerService: CompleterService,
    private obraService: ObraService,
    private modalService: BsModalService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
  }

  ngOnInit() {

    //inicializamos el auto-completer
    this.dataServiceCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');
    this.dataServiceObra = this.completerService.remote(this.obraService.urlBuscarPorNombre, 'nombre', 'nombre');
    //inicializamos la lista para no tener problemas con los select
    this.lstObra = [];
    this.resetVariables();

    this.spinnerService.show();

    //Consultamos las unidades para el autocompleter
    this.unidadService.listarTodos().subscribe(res => {

      this.dataServiceUnidad = this.completerService.local(res, 'nombre', 'nombre');

      /*
   * obtenemos el parametro y establecemos si es edicion o no, si es edicion ocultamos el 
   * formulario principal y mostramos otro en el cual buscaremos lo que vamos a editar, si no es 
   * edicion, mostramos el formulario directamente para proceder con el registro
   */
      this._route.params.subscribe((params: Params) => {

        if (params['edicion'] == 'editar') {
          this.edicion = true;
          this.mostrarForm = false;
          this.title = 'Edición de canal';

        } else if (params['edicion'] == 'registrar') {
          this.edicion = false;
          this.mostrarForm = true;
          this.title = 'Registro de canal';
        } else {
          //si no coincide con ninguno lo enviamos a otra pagina
          this._router.navigate(['/']);
        }

        this.spinnerService.hide();
      });

    }, err => {
      this.spinnerService.hide();
    });

    this.obraService.listar().subscribe(res => {
      this.lstObra = res;
    });
  }

  //evento del autocompleter buscar canal
  onSelectedCanal(selected: CompleterItem) {

    if (selected) {

      this.spinnerService.show();

      this.canalService.buscarPorId(selected.originalObject.id).subscribe(res => {

        //asignamos la respuesta al objeto para que se muestre en el formulario
        this.canal = res;

        //inicializamos las listas necesarias para que funcione correctamente 
        this.lstCanalObra = this.canal.lstCanalObra;
        this.lstSeccionCanal = this.canal.lstSeccionCanal;

        this.lstSeccionCanal.forEach(item => {

          let unidad = item.seccionId.zonaId.unidadId.nombre;
          let zona = item.seccionId.zonaId.nombre;
          let seccion = item.seccionId.nombre;
          //creamos la lista que visualiza el usuario de las secciones por donde pasa el canal
          this.lstUbicacionCanal.push(`${unidad} - ${zona} - ${seccion}`);

        });

        //necesario para que no bloquee el el boton de registrar
        this.categoriaChange();

        this.mostrarForm = true;
        this.spinnerService.hide();

      }, err => {
        this.estatus = 0;
        this.spinnerService.hide();
      });

    }
  }

  //evento del auto-completer en el tabset
  onCanalSelect(selected: CompleterItem) {

    this.canalId = null;

    if (selected) {
      this.canalId = selected.originalObject.id;
    }
    this.categoriaChange();
  }

  //autocompleter unidad
  onSelectedUnidad(selected: CompleterItem) {

    //limpiamos los valores de los autocompleter que estan en cascada
    this.unidadId = null;
    this.zonaId = null;
    this.zonaCompleter = '';
    this.seccionId = null;
    this.seccionCompleter = '';

    if (selected) {

      this.spinnerService.show();

      //obtenemos la unidad y luego consultamos las zonas que pertenecen a la unidad
      this.unidadId = selected.originalObject;

      this.zonaService.buscarPorUnidadId(this.unidadId.id).subscribe(res => {

        this.dataServiceZona = this.completerService.local(res, 'nombre', 'nombre');
        this.spinnerService.hide();

      }, err => {
        this.estatus = 0;
        this.spinnerService.hide();
      });

    }
  }

  //autocompleter zona 
  onSelectedZona(selected: CompleterItem) {

    //limpioamos el autocompleter en cascada
    this.zonaId = null;
    this.seccionId = null;
    this.seccionCompleter = '';

    if (selected) {

      this.zonaId = selected.originalObject;

      this.spinnerService.show();

      //consultamos las secciones que pertenecen a la zona
      this.seccionService.buscarPorZonaId(this.zonaId.id).subscribe(res => {

        this.dataServiceSeccion = this.completerService.local(res, 'nombre', 'nombre');

        this.spinnerService.hide();

      }, err => {
        this.estatus = 0;
        this.spinnerService.hide();
      });

    }
  }

  onSelectedSeccion(selected: CompleterItem) {

    this.seccionId = null;

    if (selected) {
      //obtenemos la eccion que se ha seleccionado
      this.seccionId = selected.originalObject;
    }
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
    co.x = this.gX;
    co.y = this.gY;
    co.altitud = this.gAltitud;

    this.lstCanalObra.push(co);

    this.idObra = -1;
    this.obraDescripcion = '';
    this.gX = undefined;
    this.gY = undefined;
    this.gAltitud = undefined;
  }

  eliminarObra(index: number) {
    this.lstCanalObra.splice(index, 1);
  }

  editarObra(template: TemplateRef<any>) {

    //reemplazamos el objeto viejo por el nuevo
    this.lstCanalObra[this.indexCanalObra] = this.canalObraEditar;

    this.canalObraEditar = new CanalObra();
    this.modalRef.hide();


  }

  openModalEditar(template: TemplateRef<any>, index: number) {
    //establesco el indice de la lista el cual se va a modificar
    this.indexCanalObra = index;
    //llenamos el objeto que se usara en el modal para modificarlo
    this.canalObraEditar = this.lstCanalObra[index];
    this.obraCompleter = this.canalObraEditar.obraId.nombre;
    //mostramos el modal
    this.modalRef = this.modalService.show(template);
  }

  onSelectedObra(selected: CompleterItem) {

    this.canalObraEditar.obraId = null;

    if (selected) {
      this.canalObraEditar.obraId = selected.originalObject;
    }

  }

  registrar(form) {

    this.spinnerService.show();

    this.canal.lstSeccionCanal = this.lstSeccionCanal;
    this.canal.lstCanalObra = this.lstCanalObra;

    if (this.canalId != null) this.canal.canalId = this.canalId;

    if (this.edicion) {

      console.log(JSON.stringify(this.canal));

      this.canalService.editar(this.canal).subscribe(res => {
        this.spinnerService.hide();

        this.mostrarForm = false;
        this.estatus = 1;
        this.staticTabs.tabs[0].active = true;
        form.reset();
        this.resetVariables();
        this.resetEstatus();
        this.spinnerService.hide();

      }, err => {
        this.spinnerService.hide();
        this.estatus = 0;
      });

    } else {
      this.canalService.existeCanalPorCodigo(this.canal.codigo).subscribe(res => {

        if (res.existe) {
          this.estatus = 2;
          this.resetEstatus();
          this.spinnerService.hide();
        } else {

          this.canalService.registrar(this.canal).subscribe(res => {
            this.spinnerService.hide();

            this.estatus = 1;
            this.staticTabs.tabs[0].active = true;
            form.reset();
            this.resetVariables();
            this.resetEstatus();

          }, err => {
            this.spinnerService.hide();
          });
        }
      }, err => {
        this.estatus = 0;
        this.resetEstatus();
        this.spinnerService.hide();
      });
    }
  }

  agregarSeccion() {

    //verificamos que los datos sean correctos
    if (this.seccionId == null || this.zonaId == null || this.unidadId == null) return;

    //verificamos que la seccion a agregar no este en la lista
    for (let u of this.lstSeccionCanal) {
      if (u.seccionId.id == this.seccionId.id) {

        this.estatus = 3;
        this.resetEstatus();
        return;
      }
    }

    //Armamos el objeto para adicionarlo a la lista
    let seccionCanal = new SeccionCanal();
    let seccion = new Seccion();
    seccion.id = this.seccionId.id;
    seccionCanal.seccionId = seccion;

    //datos que se agregaran al objeto canal y se registrara
    this.lstSeccionCanal.push(seccionCanal);

    //Armamos el string para mostrarlo en la lista al usuairo
    let ubicacion = this.unidadId.nombre + ' - ' + this.zonaId.nombre + ' - ' + this.seccionId.nombre;

    this.lstUbicacionCanal.push(ubicacion);

    //reseteamos los valores de los autocompleter
    this.zonaId = null;
    this.seccionId = null;
    this.unidadId = null;
    this.zonaCompleter = '';
    this.seccionCompleter = '';
    this.unidadCompleter = '';
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

      if (this.canalId == null || this.canalCompleter == '') {
        this.disabledObras = true;
      } else {
        this.disabledObras = false;
      }
    }
  }

  onClickCancelar() {
    this.resetVariables();
    this.mostrarForm = false;
  }

  private resetVariables() {
    this.canal = new Canal();
    this.canal.codigo = '';
    this.canal.categoria = '';
    this.canal.seccionTipica = '';
    this.canal.tipo = '';
    this.canal.estado = '';
    this.canal.clase = '';
    this.unidadId = null;
    this.zonaId = null;
    this.seccionId = null;
    this.lstUbicacionCanal = [];
    this.lstSeccionCanal = [];
    this.lstSeccionCanal = [];
    this.lstUbicacionCanal = [];
    this.lstCanalObra = [];
    this.obraDescripcion = '';
    this.idObra = -1;
    this.canalId = null;
    this.canalCompleter = '';
    this.unidadCompleter = '';
    this.zonaCompleter = '';
    this.seccionCompleter = '';
    this.disabledObras = true;
    this.gX = undefined;
    this.gY = undefined;
    this.gAltitud = undefined;
    this.canalObraEditar = new CanalObra();
  }


}
