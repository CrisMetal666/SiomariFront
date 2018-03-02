import { Component, OnInit } from '@angular/core';
import { Cultivo } from '../../../_model/cultivo';
import { CultivoService } from '../../../_service/cultivo.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Kc } from '../../../_model/kc';

@Component({
  selector: 'app-cultivo',
  templateUrl: './cultivo.component.html',
  styleUrls: ['./cultivo.component.css']
})
export class CultivoComponent {

  public cultivo: Cultivo;
  //determinara el tamaño del array de los Kc
  //public meses: number;
  //array donde almacenaran los kc
  private kc: number[];
  //se guardara el valor del kc para despues almacenarlo en el array
  public kcValor: number;
  public estado: number;

  constructor(
    private cultivoService: CultivoService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.resetVariables();
  }

  agregarKc() {
    this.kc.push(this.kcValor);
    this.kcValor = undefined;
  }

  eliminarKc(index: number) {
    this.kc.splice(index, 1);
  }

  registrar(form) { 

    this.spinnerService.show();
    
    this.cultivoService.existeCultivo(this.cultivo.nombre).subscribe((res: any) => {

      if(res.existe) {
        this.estado = 2;
        this.spinnerService.hide();
      } else {

        let lstKc: Kc[] = [];
        this.kc.forEach((k,index) => {
          let item = new Kc();
          item.mes = index +1;
          item.kc = k;
          lstKc.push(item);
        });

        this.cultivo.lstKc = lstKc;

        this.cultivoService.registrar(this.cultivo).subscribe(res => {

          this.spinnerService.hide();

          if(res.id != 0) {
            this.estado = 1;
            form.reset();
            this.resetVariables();
          } else {
            this.estado = 0;
          }
        });
      }
    });
  }

  resetVariables() {
    this.cultivo = new Cultivo();
    this.kc = [];
  }

}
