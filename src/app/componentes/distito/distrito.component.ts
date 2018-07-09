import { Component, OnInit } from '@angular/core';
import { DistritoService } from '../../_service/distrito.service';
import { Distrito } from '../../_model/distrito';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-distito',
  templateUrl: './distrito.component.html',
  styleUrls: ['./distito.component.css']
})
export class DistritoComponent implements OnInit {

  // guardara la informacion a registrar
  distrito: Distrito;
  estado: number;

  constructor(
    private distritoService: DistritoService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {
    this.distrito = new Distrito();
  }

  ngOnInit() {

    this.spinnerService.show();

    this.distritoService.getNombre().subscribe(res => {

      this.estado = undefined;

      if (res == null) {
        this.spinnerService.hide();
        return;
      }

      this.distrito = res;
      this.spinnerService.hide();
    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  guardar() {

    this.spinnerService.show();

    this.distritoService.guardar(this.distrito).subscribe(res => {

      if (res) {
        this.estado = 1;
      } else {
        this.estado = 0;
      }

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

}
