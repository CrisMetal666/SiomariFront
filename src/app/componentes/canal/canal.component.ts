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
  // auto-completer
  public canalCompleter: string;
  public unidadCompleter: string;
  public zonaCompleter: string;
  public seccionCompleter: string;
  public dataServiceCanal: CompleterData;
  public dataServiceUnidad: CompleterData;
  public dataServiceZona: CompleterData;
  public dataServiceSeccion: CompleterData;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;
  // deshablilitar el boton de guardar
  disabledGuardar: boolean;


  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private seccionService: SeccionService,
    private canalService: CanalService,
    private completerService: CompleterService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
  }

  ngOnInit() {

    //inicializamos el auto-completer
    this.dataServiceCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');
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

        //reseteamos las variables cada vez que cambien de pagina (editar,registrar)
        this.resetVariables();
        this.estatus = undefined;
        if (this.staticTabs != undefined) {
          // movemos el tab a la primera posicion
          this.staticTabs.tabs[0].active = true;
        }

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

  }

  //evento del autocompleter buscar canal
  onSelectedCanal(selected: CompleterItem) {

    if (selected) {

      this.spinnerService.show();

      this.canalService.buscarPorId(selected.originalObject.id).subscribe(res => {

        //asignamos la respuesta al objeto para que se muestre en el formulario
        this.canal = res;

        this.lstSeccionCanal = this.canal.lstSeccionCanal;

        this.lstSeccionCanal.forEach(item => {

          let unidad = item.seccionId.zonaId.unidadId.nombre;
          let zona = item.seccionId.zonaId.nombre;
          let seccion = item.seccionId.nombre;
          //creamos la lista que visualiza el usuario de las secciones por donde pasa el canal
          this.lstUbicacionCanal.push(`${unidad} - ${zona} - ${seccion}`);

        });

        if (res.canalId != null) {
          // guardamos el canal y lo mostramos en el autocompleter
          this.canalId = res.canalId;
          this.canalCompleter = this.canalId.nombre;
        }

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

  registrar(form) {

    this.spinnerService.show();

    //llenamos las listas
    this.canal.lstSeccionCanal = this.lstSeccionCanal;

    //asignamos id del si canal si el canal pertenece a un canal padre
    if (this.canalId != null) this.canal.canalId = this.canalId;

    //comprobamos que el canal no haya sido registrado antes
    this.canalService.existeCanalPorCodigo(this.canal.codigo).subscribe(res => {

      let id = res.existe;

      if (this.edicion) {

        //nos aseguramos que el nombre que se vaya a editar no exista
        if (id != 0 && this.canal.id != id) {
          this.estatus = 2;
          this.spinnerService.hide();
          return;
        }

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

        //verificamos que el nombre a registrar no exista
        if (id != 0) {
          this.estatus = 2;
          this.spinnerService.hide();
          return;
        }

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

  // bloqueara el boton de guardar dependiendo la categoria seleccionada
  categoriaChange() {

    if (this.canal.categoria == '') this.disabledGuardar = true;

    if (this.canal.categoria == 'CANAL_ADUCCION' || this.canal.categoria == 'CANAL_PRINCIPAL') {
      this.disabledGuardar = false;
    } else {

      if (this.canalId == null || this.canalCompleter == '') {
        this.disabledGuardar = true;
      } else {
        this.disabledGuardar = false;
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
    this.canalId = null;
    this.canalCompleter = '';
    this.unidadCompleter = '';
    this.zonaCompleter = '';
    this.seccionCompleter = '';
    this.disabledGuardar = true;
  }


}
