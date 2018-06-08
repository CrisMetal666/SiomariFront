import { Component, OnInit } from '@angular/core';
import { CanalService } from '../../_service/canal.service';
import { ManejoAguaService } from '../../_service/manejo-agua.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ManejoAgua } from '../../_model/manejo-agua';
import { Canal } from '../../_model/canal';

@Component({
  selector: 'app-manejo-agua-registrar',
  templateUrl: './manejo-agua-registrar.component.html',
  styleUrls: ['./manejo-agua-registrar.component.css']
})
export class ManejoAguaRegistrarComponent implements OnInit {

  //objeto principal donde se guardara los datos a registrar
  public manejoAgua: ManejoAgua;
  //guarda un valor numerico para mostrar un mensaje al usuario
  public estado: number;
  //autocompleter canal
  public dataServiceCanal: CompleterData;
  public canal: Canal;
  // determinara si se ha seleccionado un canal
  public seleccionado: boolean;
  //se almacenara el nombre del canal para mostrarlo en el form cuando sea seleccionado
  public nombreCanal: string;

  constructor(
    private canalService: CanalService,
    private manejoAguaService: ManejoAguaService,
    private spinnerService: Ng4LoadingSpinnerService,
    private completerService: CompleterService
  ) {
    this.seleccionado = false;
  }

  ngOnInit() {
    this.dataServiceCanal = this.completerService.remote(this.canalService.urlListarPorNombreOCodigo, 'nombre,codigo', 'nombre');
    this.resetVariables();
  }

  onCanalSelect(selcted: CompleterItem) {

    this.canal = null;
    //desactivamos el autocompleter
    this.seleccionado = false;

    if (selcted) {
      this.canal = new Canal();
      this.canal.id = selcted.originalObject.id;
      //activamos el autocompleter
      this.seleccionado = true;
    }
  }

  registrar(form) {

    this.manejoAgua.canalId = this.canal;

    this.spinnerService.show();

    this.manejoAguaService.registrar(this.manejoAgua).subscribe(res => {

      //si el estado es 202 significa que el registro ya existe
      if (res.status == 202) {
        this.estado = 2;
      } else {
        this.estado = 1;
        this.resetVariables();
        form.form.reset();
      }

      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  cancelar(form) {
    this.resetVariables();
    form.reset();
    this.seleccionado = false;
  }

  resetVariables(): void {
    this.manejoAgua = new ManejoAgua();
  }

}
