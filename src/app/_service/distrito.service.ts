import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Distrito } from '../_model/distrito';
import { HeaderToken } from './header-token';
import { Divoper } from '../_model/divoper';

@Injectable()
export class DistritoService {

  private url: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}distrito/`;
    this.header = new HeaderToken();
  }

  guardar(distrito: Distrito) {
    return this.http.post<boolean>(this.url, distrito,
      this.header.getHeader()
    );
  }

  getNombre() {
    return this.http.get<Distrito>(this.url,
      this.header.getHeader()
    );
  }

  consultaGeneral(id: number, tipo: number) {

    return this.http.get<Divoper>(`${this.url}consultaGeneral/${id}/${tipo}`,
      this.header.getHeader()
    );
  }

}
