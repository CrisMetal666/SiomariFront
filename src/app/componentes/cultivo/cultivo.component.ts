import { Component, OnInit } from '@angular/core';
import { Cultivo } from '../../_model/cultivo';
import { CultivoService } from '../../_service/cultivo.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Kc } from '../../_model/kc';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';

@Component({
  selector: 'app-cultivo',
  templateUrl: './cultivo.component.html',
  styleUrls: ['./cultivo.component.css']
})
export class CultivoComponent implements OnInit {

  //objeto principal donde se almacenara la informacion a guardar
  public cultivo: Cultivo;
  //array donde almacenaran los kc
  private kc: Kc[];
  //se guardara el valor del kc para despues almacenarlo en el array
  public kcValor: number;
  //dependiendo del valor numerico se mostrara un mensaje al usuario
  public estado: number;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //se guardaran las unidades para el autocompleter
  public dataServiceCultivo: CompleterData;
  //titulo de la pagina
  public title: string;
  //text que se mostrara en el autocompleter del formulario
  private cultivoCompleter: string;

  constructor(
    private cultivoService: CultivoService,
    private spinnerService: Ng4LoadingSpinnerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private completerService: CompleterService
  ) {
  }

  ngOnInit() {
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
        this.title = 'Edición de cultivo';

        this.dataServiceCultivo = this.completerService.remote(this.cultivoService.urlBuscarIdNombrePorNombre, 'nombre', 'nombre');

      } else if (params['edicion'] == 'registrar') {
        this.edicion = false;
        this.mostrarForm = true;
        this.title = 'Registro de cultivo';
      } else {
        //si no coincide con ninguno lo enviamos a otra pagina
        this._router.navigate(['/']);
      }
    });
  }

  // evento del autocompleter para seleccionar el cultivo a editar
  onSelectedCultivo(selected: CompleterItem) {
    //cuando seleccionen el cultivo tremos toda la informacion de la base de datos
    if (selected) {
      this.spinnerService.show();

      this.cultivoService.listarPorId(selected.originalObject.id).subscribe(res => {
        //llenamos el objeto principal
        this.cultivo = res;
        //asignamos los valores Kc al array para que el usuario pueda visualizarlos 
        this.kc = this.cultivo.lstKc;

        //ordenamos la lista por decada en orden ascendente
        this.kc.sort((n1, n2) => {
          if (n1.decada > n2.decada) {
            return 1;
          }
          if (n1.decada < n2.decada) {
            return -1;
          }
          return 0;
        });

        this.mostrarForm = true;
        this.spinnerService.hide();
      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
    }
  }

  //agregamos el kc al array
  agregarKc() {
    let kcItem = new Kc();
    kcItem.kc = this.kcValor;
    this.kc.push(kcItem);
    this.kcValor = undefined;
  }

  eliminarKc(index: number) {
    this.kc.splice(index, 1);
  }

  onClickCancelar() {
    this.resetVariables();
    this.mostrarForm = false;
  }

  registrar(form) {

    this.spinnerService.show();

    //le asignamos la decada segun la posicion del array
    this.kc.forEach((k, index) => {
      k.decada = index + 1;
    });

    this.cultivo.lstKc = this.kc;

    this.cultivoService.existeCultivo(this.cultivo.nombre).subscribe((res: any) => {

      let id = res.existe;

      if (this.edicion) {

        //nos aseguramos que el nombre que se vaya a editar no exista
        if (id != 0 && this.cultivo.id != id) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.cultivoService.editar(this.cultivo).subscribe(res => {

          this.estado = 1;
          form.reset();
          this.resetVariables();
          this.mostrarForm = false;

          this.spinnerService.hide();

        });

      } else {

        //verificamos que el nombre a registrar no exista
        if (id != 0) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.cultivoService.registrar(this.cultivo).subscribe(res => {

          this.estado = 1;
          form.reset();
          this.resetVariables();

          this.spinnerService.hide();

        });

      }

    });

  }

  resetVariables() {
    this.cultivo = new Cultivo();
    this.kc = [];
  }

}
