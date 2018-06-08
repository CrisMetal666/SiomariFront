import { Component, OnInit } from '@angular/core';
import { Seccion } from '../../_model/seccion';
import { Zona } from '../../_model/zona';
import { UnidadService } from '../../_service/unidad.service';
import { ZonaService } from '../../_service/zona.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Unidad } from '../../_model/unidad';
import { SeccionService } from '../../_service/seccion.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.css']
})
export class SeccionComponent implements OnInit {

  //objeto principal donde se almacenara al informacion a registrar
  public seccion: Seccion;
  //segun el valor que almacene se mostrara un mensaje al usuario
  public estado: number;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;
  //se guardan las unidades para usar los autocompleter
  public dataServiceUnidad: CompleterData;
  //se guardan las zonas para usar los autocompleter
  public dataServiceZona: CompleterData;
  //se guardan las secciones para usar los autocompleter
  public dataServiceSeccion: CompleterData;
  //se guarda el objeto seleccionado en el autocompleter unidad
  public unidadId: Unidad;
  //se guarda el objeto seleccionado en el autocompleter zona
  public zonaId: Zona;
  //texto que se mostrara en el autocompleter unidad del formulario
  public unidadCompleter: string;
  //texto que se mostrara en el autocompleter zona del formulario
  public zonaCompleter: string;


  constructor(
    private unidadService: UnidadService,
    private zonaService: ZonaService,
    private spinnerService: Ng4LoadingSpinnerService,
    private seccionService: SeccionService,
    private _route: ActivatedRoute,
    private _router: Router,
    private completerService: CompleterService
  ) {
  }

  ngOnInit() {
    this.spinnerService.show();
    this.resetVariables();

    //primero traemos la informacion de las unidades necesaria ya sea para editar o registrar
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
        this.estado = undefined;

        if (params['edicion'] == 'editar') {
          this.edicion = true;
          this.mostrarForm = false;
          this.title = 'Edición de sección';

        } else if (params['edicion'] == 'registrar') {
          this.edicion = false;
          this.mostrarForm = true;
          this.title = 'Registro de sección';
        } else {
          //si no coincide con ninguno lo enviamos a otra pagina
          this._router.navigate(['/']);
        }

        this.spinnerService.hide();
      });

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  //autocompleter unidad
  onSelectedUnidad(selected: CompleterItem) {

    this.zonaId = null;
    this.zonaCompleter = '';

    if (selected) {

      this.spinnerService.show();

      this.unidadId = selected.originalObject;

      this.zonaService.buscarPorUnidadId(this.unidadId.id).subscribe(res => {

        this.dataServiceZona = this.completerService.local(res, 'nombre', 'nombre');
        this.spinnerService.hide();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });

    } else {
      this.unidadId = null;
    }
  }

  //autocompleter zona 
  onSelectedZona(selected: CompleterItem) {

    if (selected) {

      this.zonaId = selected.originalObject;

      /*
       * si el formulario esta oculto, significa que estamos buscando la seccion para editarla
       * asi que buscamos las secciones que estan dentro de la zona seleccionada
       */
      if (!this.mostrarForm) {

        this.spinnerService.show();

        this.seccionService.buscarPorZonaId(this.zonaId.id).subscribe(res => {

          this.dataServiceSeccion = this.completerService.local(res, 'nombre', 'nombre');

          this.spinnerService.hide();

        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });
      }
    } else {
      this.zonaId = null;
    }
  }

  onSelectedSeccion(selected: CompleterItem) {
    if (selected) {

      //llenamos los objetos que se visualizaran en el formulario
      this.seccion = selected.originalObject;
      this.unidadCompleter = this.unidadId.nombre;
      this.zonaCompleter = this.zonaId.nombre;

      //mostramos el formulario
      this.mostrarForm = true;
    }
  }

  /*
   * evento asociado al autocompleter unidad del formulario, sirve para asegurarnos
   * que el usuario haya seleccionado la unidad
   */
  onKeyUpUnidad() {
    this.unidadId = null;
    this.zonaId = null;
    this.zonaCompleter = '';
  }

  /*
   * evento asociado al autocompleter zona del formulario, sirve para asegurarnos
   * que el usuario haya seleccionado la zona
   */
  onKeyUpZona() {
    this.zonaId = null;
  }

  onClickCancelar() {
    this.resetVariables();
    this.mostrarForm = false;
  }

  registrar(form) {

    //aseguramos que todo se haya seleccionado correctamente
    if (this.zonaId == null || this.zonaCompleter == '') return;

    this.spinnerService.show();

    //llenamos los valores de unidad y zona al objeto principal
    this.seccion.zonaId = this.zonaId;

    //verificamos que el nombre no exista
    this.seccionService.existePorNombreYZona(this.seccion.nombre, this.seccion.zonaId.id).subscribe(res => {

      let id = res.existe;

      if (this.edicion) {

        //nos aseguramos que el nombre que se vaya a editar no exista
        if (id != 0 && this.seccion.id != id) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.seccionService.editar(this.seccion).subscribe(res => {
          this.spinnerService.hide();

          this.estado = 1;
          form.reset();
          this.resetVariables();
          this.mostrarForm = false;

        }, err => {
          this.spinnerService.hide();
          this.estado = 0;
        });

      } else {

        //verificamos que el nombre a registrar no exista
        if (id != 0) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.seccionService.registrar(this.seccion).subscribe((res: Seccion) => {
          this.spinnerService.hide();

          this.estado = 1;
          form.reset();
          this.resetVariables();

        }, err => {
          this.spinnerService.hide();
          this.estado = 0;
        });
      }
    });


  }

  private resetVariables() {
    this.seccion = new Seccion();
    this.unidadId = null;
    this.zonaId = null;
    this.unidadCompleter = '';
    this.zonaCompleter = '';
  }

}
