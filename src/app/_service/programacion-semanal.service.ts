import { Injectable } from '@angular/core';
import { url } from './var.const';
import { HttpClient } from '@angular/common/http';
import { ProgramacionSemanal } from '../_model/programacion-semanal';

@Injectable()
export class ProgramacionSemanalService {

  private url: string;

  constructor(
    private http: HttpClient
  ) { 
    this.url = `${url}programacionSemanal/`;
  }

  /**
   * se guardara el modelo
   * @param programacionSemanal modelo a guardar
   */
  guardar(programacionSemanal: ProgramacionSemanal) {

    return this.http.post<ProgramacionSemanal>(this.url, programacionSemanal);
  }

}
