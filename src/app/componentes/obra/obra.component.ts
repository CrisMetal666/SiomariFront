import { Component, OnInit } from '@angular/core';
import { Obra } from '../../_model/obra';
import { ObraService } from '../../_service/obra.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-obra',
  templateUrl: './obra.component.html',
  styleUrls: ['./obra.component.css']
})
export class ObraComponent implements OnInit {

  public obra: Obra;
  //dependiendo del valor nunmerico especificado mostrara un mensaje al usuario
  public estado: number;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //se guardaran las obras para el autocompleter
  public dataServiceObra: CompleterData;
  //titulo de la pagina
  public title: string;

  constructor(
    private obraService: ObraService,
    private spinnerService: Ng4LoadingSpinnerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private completerService: CompleterService
  ) {
    this.obra = new Obra();
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
        this.title = 'Edición de obra';

        //inicializamos los datos para el autocompleter
        this.spinnerService.show();
        this.obraService.listar().subscribe(res => {
          this.dataServiceObra = this.completerService.local(res, 'nombre', 'nombre');
          this.spinnerService.hide();
        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });

      } else if (params['edicion'] == 'registrar') {
        this.edicion = false;
        this.mostrarForm = true;
        this.title = 'Registro de obra';
      } else {
        //si no coincide con ninguno lo enviamos a otra pagina
        this._router.navigate(['/']);
      }
    });
  }

  onSelectedObra(selected: CompleterItem) {
    if (selected) {
      this.obra = selected.originalObject;
      this.mostrarForm = true;
    }
  }

  onClickCancelar() {
    this.obra = new Obra();
    this.mostrarForm = false;
  }

  registrar(form) {

    this.spinnerService.show();

    // veriicamos si estmos editando o registrando
    if (this.edicion) {

      this.obraService.editar(this.obra).subscribe(res => {

        this.estado = 1;
        form.reset();
        this.obra = new Obra();
        this.mostrarForm = false;

        this.obraService.listar().subscribe(res => {
          this.dataServiceObra = this.completerService.local(res, 'nombre', 'nombre');
          this.spinnerService.hide();
        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });

    } else {

      // antes de registrar nos aseguramos que el nombre de la obra no exista
      this.obraService.existePorNombre(this.obra.nombre).subscribe(res => {

        if (res.existe) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.obraService.registrar(this.obra).subscribe(res => {

          this.estado = 1;
          form.reset();
          this.obra = new Obra();

          this.spinnerService.hide();

        }, err => {

          this.estado = 0;
          this.spinnerService.hide();
        });

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
    }

  }

}
