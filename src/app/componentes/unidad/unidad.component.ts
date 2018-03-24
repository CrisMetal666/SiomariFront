import { Component, OnInit } from '@angular/core';
import { Unidad } from '../../_model/unidad';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UnidadService } from '../../_service/unidad.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent implements OnInit {

  //objeto principal donde se almacenan la informacion a guardar
  public unidad: Unidad;
  //dependiendo del valor nunmerico especificado mostrara un mensaje al usuario
  public estado: number;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //se guardaran las unidades para el autocompleter
  public dataServiceUnidad: CompleterData;
  //titulo de la pagina
  public title: string;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private completerService: CompleterService
  ) {
    this.unidad = new Unidad();
  }

  ngOnInit() {
    /*
    * obtenemos el parametro y establecemos si es edicion o no, si es edicion ocultamos el 
    * formulario principal y mostramos otro en el cual buscaremos lo que vamos a editar, si no es 
    * edicion, mostramos el formulario directamente para proceder con el registro
    */
    this._route.params.subscribe((params: Params) => {

      if (params['edicion'] == 'editar') {
        this.edicion = true;
        this.mostrarForm = false;
        this.title = 'Edición de unidad';

        //inicializamos los datos para el autocompleter
        this.spinnerService.show();
        this.unidadService.listarTodos().subscribe(res => {
          this.dataServiceUnidad = this.completerService.local(res, 'nombre', 'nombre');
          this.spinnerService.hide();
        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });

      } else if (params['edicion'] == 'registrar') {
        this.edicion = false;
        this.mostrarForm = true;
        this.title = 'Registro de unidad';
      } else {
        //si no coincide con ninguno lo enviamos a otra pagina
        this._router.navigate(['/']);
      }
    });
  }

  //se selecciona la unidad que se va a editar
  onSelectedUnidad(selected: CompleterItem) {
    if (selected) {
      this.unidad = selected.originalObject;
      this.mostrarForm = true;
    }
  }

  onClickCancelar() {
    this.unidad = new Unidad();
    this.mostrarForm = false;
  }

  registrar(form) {

    this.spinnerService.show();

    this.unidadService.existePorNombre(this.unidad.nombre).subscribe(res => {

      if (res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      //comprobamos si estams en de edicion o registro
      if (this.edicion) {
        this.unidadService.editar(this.unidad).subscribe((res: Unidad) => {

          this.estado = 1;
          this.unidad = new Unidad();
          form.reset();
          
          //volvemos a llenar el autocompleter con los datos nuevos
          this.unidadService.listarTodos().subscribe(res => {
            this.dataServiceUnidad = this.completerService.local(res, 'nombre', 'nombre');
            this.spinnerService.hide();
          });

          this.mostrarForm = false;

        }, err => {
          this.spinnerService.hide();
          this.estado = 0;
        });
      } else {
        this.unidadService.registrar(this.unidad).subscribe((res: Unidad) => {

          this.estado = 1;
          this.unidad = new Unidad();
          form.reset();
          this.spinnerService.hide();

        }, err => {
          this.spinnerService.hide();
          this.estado = 0;
        });
      }
    });
  }

}
