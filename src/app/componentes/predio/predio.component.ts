import { Component, ViewChild, OnInit } from '@angular/core';
import { Canal } from '../../_model/canal';
import { CanalService } from '../../_service/canal.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Predio } from '../../_model/predio';
import { PredioService } from '../../_service/predio.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-predio',
  templateUrl: './predio.component.html',
  styleUrls: ['./predio.component.css']
})
export class PredioComponent implements OnInit {

  //guarda el valor del select canal
  public canalId: Canal;
  //---------------------------- listas para los select
  public lstCanal: Canal[];
  //----------------------------
  public predio: Predio;
  //dependiendo del valor numerico, se mostrara un mensaje al usuario
  public estado: number;
  // auto-completer
  public searchCanal: string;
  public searchPredio: string;
  public dataServiceCanal: CompleterData;
  public dataServicePredio: CompleterData;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private predioService: PredioService,
    private completerService: CompleterService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    this.resetVariables();
    this.lstCanal = [];
    this.dataServiceCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');
    this.dataServicePredio = this.completerService.remote(this.predioService.urlBuscarIdCodigoNombrePorNombreOCodigo, 'nombre,codigo', 'nombre');
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
        this.title = 'Edición de Predio';

      } else if (params['edicion'] == 'registrar') {
        this.edicion = false;
        this.mostrarForm = true;
        this.title = 'Registro de Predio';
      } else {
        //si no coincide con ninguno lo enviamos a otra pagina
        this._router.navigate(['/']);
      }
    });
  }

  //evento del auto-completer
  onCanalSelect(selected: CompleterItem) {
    if (selected) {
      this.canalId = new Canal();
      this.canalId.id = selected.originalObject.id;
    } else {
      this.canalId = null;
    }
  }

  onKeyUpCanal() {
    this.canalId = null;
  }

  //evento del auto-completer
  onPredioSelect(selected: CompleterItem) {
    if (selected) {

      this.spinnerService.show();

      //traemos toda la informacion del predio seleccionado
      this.predioService.buscarPorId(selected.originalObject.id).subscribe(res => {

        //le asignamos el valor consultado para que sea mostrado en el formulario
        this.predio = res;
        //se ncesita iniciaizar para que el formulario funcione correctamente
        this.canalId = res.canalId;
        //text que se mostrara en el autocompleter
        this.searchCanal = this.canalId.nombre;

        this.mostrarForm = true;

        this.spinnerService.hide();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });

    } else {
      this.canalId = null;
    }
  }

  registrar(form) {

    if (this.searchCanal == '') {
      this.estado = 3;
    }

    this.predio.canalId = this.canalId;

    this.spinnerService.show();

    this.predioService.existePorCodigo(this.predio.codigo).subscribe(res => {

      let id = res.existe;

      if (this.edicion) {

        //nos aseguramos que el nombre que se vaya a editar no exista
        if (id != 0 && this.predio.id != id) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.predioService.editar(this.predio).subscribe(res => {
  
          this.estado = 1;
          form.reset();
          this.resetVariables();
          this.mostrarForm = false;
  
          this.spinnerService.hide();
  
        }, err => {
          this.spinnerService.hide()
          this.estado = 0;
        });
  
      } else {

        //verificamos que el nombre a registrar no exista
        if (id != 0) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }
  
        this.predioService.registrar(this.predio).subscribe(res => {

          this.estado = 1;
          form.reset();
          this.resetVariables();
  
          this.spinnerService.hide();
  
        }, err => {
          this.spinnerService.hide()
          this.estado = 0;
        });
      }

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

    

  }

  onClickCancelar() {
    this.mostrarForm = false;
    this.resetVariables();
  }

  resetVariables(): void {
    this.predio = new Predio();
    this.canalId = null;
    this.searchCanal = '';
    this.searchPredio = '';
  }

}
