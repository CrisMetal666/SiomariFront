import { Component } from '@angular/core';
import { Usuario } from '../../../_model/usuario';
import { Predio } from '../../../_model/predio';
import { PredioService } from '../../../_service/predio.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { UsuarioService } from '../../../_service/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {

  private predioId: Predio;
  public usuario: Usuario;
  private estado: number;
  //auto-completer
  public searchPredio;
  public dataServicePredio: CompleterData;

  constructor(
    private predioService: PredioService,
    private spinnerService: Ng4LoadingSpinnerService,
    private completerService: CompleterService,
    private usuarioService: UsuarioService
  ) {

    spinnerService.show();

    predioService.listarSinUsuarios().subscribe(res => {
      this.dataServicePredio = this.completerService.local(res, 'nombre,codigo', 'nombre');
      spinnerService.hide();
    });

    this.resetVariables();
  }

  //evento del auto-completer
  onPredioSelect(selected: CompleterItem) {
    if (selected) {
      this.predioId = new Predio();
      this.predioId.id = selected.originalObject.id;
    }
  }

  registrar(form) {

    if (this.searchPredio == '') {
      this.estado = 3;
      return;
    }

    this.spinnerService.show();

    this.usuario.predioId = this.predioId;

    this.usuarioService.existePorCedula(this.usuario.cedula).subscribe(res => {

      if (res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      this.usuarioService.registrar(this.usuario).subscribe(res => {

        if (res.id != 0) {
          this.estado = 1;
          form.reset();
          this.resetVariables();

          this.predioService.listarSinUsuarios().subscribe(res => {
            this.dataServicePredio = this.completerService.local(res, 'nombre,codigo', 'nombre');
            this.spinnerService.hide();
          });
        } else {
          this.estado = 0;
          this.spinnerService.hide();
        }

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
    });
  }

  resetVariables() {
    this.usuario = new Usuario();
    this.predioId = new Predio();
  }
}
