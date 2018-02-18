import { Component, OnInit } from '@angular/core';
import { Unidad } from '../../../_model/unidad';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UnidadService } from '../../../_service/unidad.service';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent implements OnInit {

  unidad: Unidad;
  loading: boolean = true;
  estado: number = -1;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private unidadService: UnidadService
  ) {
    this.unidad = new Unidad();
  }

  ngOnInit() {
  }

  registrar(form) {

    this.spinnerService.show();

    this.unidadService.registrar(this.unidad).subscribe((res: Unidad) => {

      this.spinnerService.hide();

      //comprobamos si trae un id y mostramos el mensaje correspondiente dadole valor a estado
      if (res.id != 0) {
        this.estado = 1;
        this.unidad = new Unidad();
        form.reset();
      } else {
        this.estado = 0;
      }

    }, err => {
      this.spinnerService.hide();
      this.estado = 0;
    });


  }

}
