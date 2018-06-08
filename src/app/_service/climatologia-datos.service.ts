import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ClimatologiaDatos } from '../_model/climatologia-datos';
import { url } from './var.const';


@Injectable()
export class ClimatologiaDatosService {

  constructor(
    private http: HttpClient
  ) { }

  

}
