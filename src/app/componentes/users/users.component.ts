import { Component, OnInit } from '@angular/core';
import { Users } from '../../_model/users';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UsersService } from '../../_service/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  //objeto principal donde se almacenan la informacion a guardar
  public users: Users;
  //dependiendo del valor nunmerico especificado mostrara un mensaje al usuario
  public estado: number;
  //valor necesario para saber si estamos editando o registrando
  public edicion: boolean;
  //valor con el cual sabremos si debemos mostrar el formulario de registro al usuario
  public mostrarForm: boolean;
  //titulo de la pagina
  public title: string;
  // identificacion que se ingresa para buscar una cuenta en editar
  identificacion: string;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private usersService: UsersService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    /*
    * obtenemos el parametro y establecemos si es edicion o no, si es edicion ocultamos el 
    * formulario principal y mostramos otro en el cual buscaremos lo que vamos a editar, si no es 
    * edicion, mostramos el formulario directamente para proceder con el registro
    */
    this._route.params.subscribe((params: Params) => {

      // inicializamos las variables cada vez que cambie de pagina (editar, registrar)
      this.users = new Users();
      this.users.rol = '';
      this.estado = undefined;

      if (params['edicion'] == 'editar') {
        this.edicion = true;
        this.mostrarForm = false;
        this.title = 'Edición de cuenta';

      } else if (params['edicion'] == 'registrar') {
        this.edicion = false;
        this.mostrarForm = true;
        this.title = 'Registro de cuenta';
      } else {
        //si no coincide con ninguno lo enviamos a otra pagina
        this._router.navigate(['/']);
      }
    });
  }


  onClickBuscar() {

    this.spinnerService.show();

    this.usersService.buscarPorIdentificacion(this.identificacion).subscribe(res => {

      if (res.id == 0) {
        this.estado = 3;
      } else {
        this.users = res;
        this.mostrarForm = true;
        this.identificacion = '';
      }

      this.spinnerService.hide();
    });
  }

  onClickCancelar() {
    this.users = new Users();
    this.users.rol = '';
    this.identificacion = '';
    this.mostrarForm = false;
  }

  guardar(form) {

    this.spinnerService.show();

    // verificamos si estamos en modo edicion o registro
    if (this.edicion) {

      this.usersService.editar(this.users).subscribe(res => {

        this.estado = res;

        // si el registro fue exitoso ocultamos el formulario
        if(this.estado == 1) {
          this.mostrarForm = false;
        }

        this.spinnerService.hide();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });

    } else {

      // por defecto la contraseña en la misma idenficación
      this.users.clave = this.users.identificacion;

      this.usersService.registrar(this.users).subscribe(res => {

        this.estado = res;

        this.spinnerService.hide();

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });

    }
  }

}
