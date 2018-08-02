import { Component, ViewChild, OnInit } from '@angular/core';
import { Canal } from '../../_model/canal';
import { CanalService } from '../../_service/canal.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Predio } from '../../_model/predio';
import { PredioService } from '../../_service/predio.service';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Usuario } from '../../_model/usuario';
import { UsuarioService } from '../../_service/usuario.service';

@Component({
  selector: 'app-predio',
  templateUrl: './predio.component.html',
  styleUrls: ['./predio.component.css']
})
export class PredioComponent implements OnInit {

  //guarda el valor del select canal
  public canalId: Canal;
  public usuarioId: Usuario;
  //---------------------------- listas para los select
  public lstCanal: Canal[];
  //----------------------------
  public predio: Predio;
  //dependiendo del valor numerico, se mostrara un mensaje al usuario
  public estado: number;
  // auto-completer
  public searchCanal: string;
  public searchPredio: string;
  public searchUsuario: string;
  public dataServiceCanal: CompleterData;
  public dataServiceUsuario: CompleterData;
  public dataServicePredio: CompleterData;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;
  // objeto donde se almacena el archivo seleccionado
  selectedFiles: FileList;
  // visualizar o ocultar boton de descarga del plano
  verBotonDescarga: boolean;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private canalService: CanalService,
    private predioService: PredioService,
    private usuarioService: UsuarioService,
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
    this.dataServiceUsuario = this.completerService.remote(this.usuarioService.urlBuscarPorNombreCompletoOIdentificacion, 'cedula,nombreCompleto', 'nombreCompleto');
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

  //evento del auto-completer
  onUsuarioSelect(selected: CompleterItem) {
    if (selected) {
      this.usuarioId = new Usuario();
      this.usuarioId.id = selected.originalObject.id;
    } else {
      this.usuarioId = null;
    }
  }

  onKeyUpCanal() {
    this.canalId = null;
  }

  onKeyUpUsuario() {
    this.usuarioId = null;
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  //evento del auto-completer
  onPredioSelect(selected: CompleterItem) {
    if (selected) {

      this.spinnerService.show();

      //traemos toda la informacion del predio seleccionado
      this.predioService.buscarPorId(selected.originalObject.id).subscribe(res => {

        // limpiamos estados pasados
        this.estado = undefined;

        //le asignamos el valor consultado para que sea mostrado en el formulario
        this.predio = res;
        //se ncesita iniciaizar para que el formulario funcione correctamente
        this.canalId = res.canalId;
        this.usuarioId = res.usuarioId;
        //text que se mostrara en el autocompleter
        this.searchCanal = this.canalId.nombre;
        this.searchUsuario = this.predio.nombreUsuario;

        // si se tiene algun plano habilitamos la opcion de descargar el plano
        if (this.predio.plano != null) this.verBotonDescarga = true;

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

    if (this.searchCanal == '' || this.searchUsuario == '') {
      this.estado = 3;
      return;
    }

    this.predio.canalId = this.canalId;
    this.predio.usuarioId = this.usuarioId;
    let file: File = this.selectedFiles != null ? this.selectedFiles.item(0) : new File(new Array<Blob>(), '');

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

        this.predioService.guardar(this.predio, file).subscribe(res => {

          this.estado = res;

          if (this.estado == 1) {
            form.reset();
            this.resetVariables();
            this.mostrarForm = false;
          }

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

        this.predioService.guardar(this.predio, file).subscribe(res => {

          this.estado = res;

          if (this.estado == 1) {

            form.reset();
            this.resetVariables();
          }

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

  downloadPlano() {
    this.spinnerService.show();

    this.predioService.getPlano(this.predio.plano).subscribe(res => {

      this.estado = undefined;

      //obtenemos la extension del archivo
      let extension = this.predio.plano.split('.').pop();

      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = `plano-${this.predio.nombre}.${extension}`;
      a.click();

      this.spinnerService.hide();

      return url;

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
    this.verBotonDescarga = false;
    this.selectedFiles = null;
  }

}
