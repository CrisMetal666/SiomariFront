import { Component, OnInit } from '@angular/core';
import { UnidadService } from '../../_service/unidad.service';
import { Unidad } from '../../_model/unidad';
import { Zona } from '../../_model/zona';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ZonaService } from '../../_service/zona.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.css']
})
export class ZonaComponent implements OnInit {

  //se guardan las unidades para usar los autocompleter
  public dataServiceUnidad: CompleterData;
  //se guardan las zonas para usar los autocompleter
  public dataServiceZona: CompleterData;
  // objeto principal nombre se guardara la informacion que se guardara
  public zona: Zona;
  //segun el valor numerico se mostrara un mensaje al usuario
  public estado: number;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;
  //se guarda el objeto seleccionado en el autocompleter unidad
  public unidadId: Unidad;
  //texto que se muestra en el autocompler de unidad en el registro de zona
  public unidadCompleter: string;

  constructor(
    private unidadService: UnidadService,
    private spinnerService: Ng4LoadingSpinnerService,
    private zonaService: ZonaService,
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
          this.title = 'Edición de zona';

        } else if (params['edicion'] == 'registrar') {
          this.edicion = false;
          this.mostrarForm = true;
          this.title = 'Registro de zona';
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

  onSelectedUnidadBuscar(selected: CompleterItem) {
    // comprobamos que haya seleccionado la unidad y buscamos las zonas que existan en esa unidad
    if (selected) {

      this.unidadId = selected.originalObject;

      this.spinnerService.show();

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

  //evento del autocompleter del formulario de registro
  onSelectedUnidad(selected: CompleterItem) {

    // comprobamos que haya seleccionado la unidad
    if (selected) {
      this.unidadId = selected.originalObject;
    } else {
      this.unidadId = null;
    }
  }

  onSelectedZona(selected: CompleterItem) {
    if (selected) {
      //llemanos el objeto que se mostrara en el formulario
      this.zona = selected.originalObject;

      //creamos un objeto independiente para que no existan problemas de asignacion por referencia
      let unidad = new Unidad();
      unidad.id = this.unidadId.id;
      //string que se mostrara en el autocompleter de unidad
      this.unidadCompleter = this.unidadId.nombre;

      this.mostrarForm = true;
    }
  }

  /*
   * evento asociado al autocompleter del formulario para asegurarnos de que el formulario reactivo
   * trabaje bien y no deje oprimir el boton se guardar hasta que se haya seleccionado una unidad
   */
  onKeyUpUnidad() {
    this.unidadId = null;
  }

  onClickCancelar() {
    this.mostrarForm = false;
    this.resetVariables();

  }

  registrar(form) {

    //verificamos que el completer este correctamente seleccionado
    if (this.unidadId == null || this.unidadCompleter == '') return;

    this.spinnerService.show();

    //asignamos la unidad seleccionada
    let unidad = new Unidad();
    unidad.id = this.unidadId.id;
    this.zona.unidadId = unidad;

    //traemos el id de la zona por su nombre para verificar su existencia
    this.zonaService.existePorNombreYUnidad(this.zona.nombre, this.zona.unidadId.id).subscribe(res => {

      let id = res.existe;

      if (this.edicion) {

        //nos aseguramos que el nombre que se vaya a editar no exista
        if (id != 0 && this.zona.id != id) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.zonaService.editar(this.zona).subscribe((res: Zona) => {

          this.estado = 1;
          form.reset();
          this.resetVariables();
          this.mostrarForm = false;
          this.spinnerService.hide();

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

        this.zonaService.registrar(this.zona).subscribe((res: Zona) => {

          this.estado = 1;
          form.reset();
          this.resetVariables();
          this.spinnerService.hide();

        }, err => {
          this.spinnerService.hide();
          this.estado = 0;
        });
      }

    }, err => {
      this.spinnerService.hide();
      this.estado = 0;
    });
  }

  private resetVariables() {
    this.zona = new Zona();
    this.zona.unidadId = new Unidad();
    this.unidadId = null;
    this.unidadCompleter = '';
  }

}
