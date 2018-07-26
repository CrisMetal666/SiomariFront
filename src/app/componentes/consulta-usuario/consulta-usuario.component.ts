import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { UsuarioService } from '../../_service/usuario.service';
import { Usuario } from '../../_model/usuario';
import { Predio } from '../../_model/predio';

@Component({
  selector: 'app-consulta-usuario',
  templateUrl: './consulta-usuario.component.html',
  styleUrls: ['./consulta-usuario.component.css']
})
export class ConsultaUsuarioComponent implements OnInit {

  // autocompleter
  public dataServiceUsuario: CompleterData;
  // mostrara o ocultara el form
  consultado: boolean;
  // objeto que tendra la informacion que se mostrara en el form
  usuario: Usuario;
  //mostrara si hubo un error en durante la consulta
  estado: number;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private completerService: CompleterService,
    private usuarioService: UsuarioService,
  ) {
    this.consultado = false;
  }

  ngOnInit() {
    this.dataServiceUsuario = this.completerService.remote(this.usuarioService.urlBuscarPorNombreCompletoOIdentificacion, 'cedula,nombreCompleto', 'nombreCompleto');
  }

  onUsuarioSelect(selected: CompleterItem) {

    if (selected) {

      this.spinnerService.show();

      this.usuarioService.buscarPorId(selected.originalObject.id).subscribe(res => {

        this.usuario = res;

        //borramos cualquier estado anterior
        this.estado = undefined;

        // nos aseguramos de no dejar el predio nulo
        //if(this.usuario.predioId == null) this.usuario.predioId = new Predio();

        //mostramos el form
        this.consultado = true;

        this.spinnerService.hide();
      }, err => {
        this.estado = 0;
        this.consultado = false;
        this.spinnerService.hide();
      });
    } 
  }

}
