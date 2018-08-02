import { Component, OnInit } from '@angular/core';
import { Config } from '../../_model/config';
import { ConfigService } from '../../_service/config.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public config: Config;
  public estado: number;

  constructor(
    private configService: ConfigService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.config = new Config();
  }

  ngOnInit() {

    this.spinnerService.show();

    this.configService.listar().subscribe(res => {

      this.config = res;
      this.config.lamina = this.config.lamina / 100;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });
  }

  registrar(form) {

    this.spinnerService.show();

    this.configService.registrar(this.config).subscribe(res => {

      this.estado = 1;
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

  }

}
