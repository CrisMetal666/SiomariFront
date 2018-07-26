import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../_model/usuario';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { UsuarioService } from '../../_service/usuario.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  //objeto principal donde se guardara al infomacion
  public usuario: Usuario;
  //segun el valor numerico se mostrara un mensaje al usuiario
  private estado: number;
  //auto-completer
  public searchUsuario: string;
  public dataServiceUsuario: CompleterData;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private completerService: CompleterService,
    private usuarioService: UsuarioService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
  }

  ngOnInit() {

    this.dataServiceUsuario = this.completerService.remote(this.usuarioService.urlBuscarPorNombreCompletoOIdentificacion, 'cedula,nombreCompleto', 'nombreCompleto');
    this.resetVariables();

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
        this.title = 'Edición de Usuario';

      } else if (params['edicion'] == 'registrar') {
        this.edicion = false;
        this.mostrarForm = true;
        this.title = 'Registro de Usuario';
      } else {
        //si no coincide con ninguno lo enviamos a otra pagina
        this._router.navigate(['/']);
      }
    });
  }

  onUsuarioSelect(selected: CompleterItem) {
    if (selected) {
      this.spinnerService.show();

      this.usuarioService.buscarPorId(selected.originalObject.id).subscribe(res => {

        //guardamos la informacion en el objeto principal
        this.usuario = res;

        this.mostrarForm = true;

        this.spinnerService.hide();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
    }
  }

  registrar(form) {

    this.spinnerService.show();

    this.usuarioService.existePorCedula(this.usuario.cedula).subscribe(res => {

      let id = res.existe;

      if (this.edicion) {

        //nos aseguramos que el nombre que se vaya a editar no exista
        if (id != 0 && this.usuario.id != id) {
          this.estado = 2;
          this.spinnerService.hide();
          return;
        }

        this.usuarioService.editar(this.usuario).subscribe(res => {

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

        this.usuarioService.registrar(this.usuario).subscribe(res => {

          this.estado = 1;
          form.reset();
          this.resetVariables();

          this.spinnerService.hide();

        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });

      }


    });
  }

  onClickCancelar() {
    this.resetVariables();
    this.mostrarForm = false;
  }

  resetVariables() {
    this.usuario = new Usuario();
    this.searchUsuario = '';
  }
}
