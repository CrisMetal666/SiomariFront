import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-ditribucion-agua-mensual',
  templateUrl: './ditribucion-agua-mensual.component.html',
  styleUrls: ['./ditribucion-agua-mensual.component.css']
})
export class DitribucionAguaMensualComponent implements OnInit {

  //fecha del datepicker, debe de ser solamente los lunes
  fecha: Date;

  constructor(
    private _localeService: BsLocaleService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');
  }

}
