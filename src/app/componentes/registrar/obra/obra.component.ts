import { Component } from '@angular/core';
import { Obra } from '../../../_model/obra';
import { ObraService } from '../../../_service/obra.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-obra',
  templateUrl: './obra.component.html',
  styleUrls: ['./obra.component.css']
})
export class ObraComponent {

  public obra: Obra;
  public estado: number;

  constructor(
    private obraService: ObraService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.resetVariables();
  }

  registrar(form) {

    this.spinnerService.show();

    this.obraService.existePorNombre(this.obra.nombre).subscribe(res => {

      if(res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
        return;
      }

      this.obraService.registrar(this.obra).subscribe(res => {

        if(res.id != 0) {
          this.estado = 1;
          form.reset();
          this.resetVariables();
        } else {
          this.estado = 0;
        }

        this.spinnerService.hide();
      })
    });

  }

  resetVariables() {
    this.obra = new Obra();
  }

}
