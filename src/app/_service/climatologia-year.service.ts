import { Injectable } from '@angular/core';
import { ClimatologiaYear } from '../_model/climatologia-year';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';

@Injectable()
export class ClimatologiaYearService {

  constructor(
    private http: HttpClient
  ) { }

  buscarPorId(id: number) {
    return this.http.get<ClimatologiaYear>(`${url}climatologiaYear/${id}`);
  }

  guardar(climatologiaYear: ClimatologiaYear) {
    return this.http.post<ClimatologiaYear>(`${url}climatologiaYear`, climatologiaYear);
  }

}
