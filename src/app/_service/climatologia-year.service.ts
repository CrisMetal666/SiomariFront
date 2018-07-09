import { Injectable } from '@angular/core';
import { ClimatologiaYear } from '../_model/climatologia-year';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { HeaderToken } from './header-token';

@Injectable()
export class ClimatologiaYearService {

  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.header = new HeaderToken();
  }

  buscarPorId(id: number) {
    return this.http.get<ClimatologiaYear>(`${url}climatologiaYear/${id}`,
      this.header.getHeader()
    );
  }

  guardar(climatologiaYear: ClimatologiaYear) {
    return this.http.post<ClimatologiaYear>(`${url}climatologiaYear`, climatologiaYear,
      this.header.getHeader()
    );
  }

}
