import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from './var.const';
import { Canal } from '../_model/canal';
import { ConsultaCanal } from '../_model/consulta-canal';
import { HeaderToken } from './header-token';

@Injectable()
export class CanalService {

  private url: string;
  //usado para los autocompleter
  /**
   * consultara todos los canales
   */
  public urlListarPorNombreOCodigo: string;
  /**
   * consultara los canales que no sean de distribucion o principal
   */
  public urlListarPorNombreOCodigoServidores: string;
  /**
   * consultara los canales de distribucion o principal
   */
  public urlListarPorNombreOCodigoNoServidores: string;

  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.header = new HeaderToken();
    this.url = `${url}canal/`;
    this.urlListarPorNombreOCodigo = `${this.url}buscarPorNombreOCodigo?access_token=${this.header.getToken()}&s=`;
    this.urlListarPorNombreOCodigoServidores = `${this.url}buscarPorNombreOCodigoServidores?access_token=${this.header.getToken()}&s=`;
    this.urlListarPorNombreOCodigoNoServidores = `${this.url}buscarPorNombreOCodigoNoServidores?access_token=${this.header.getToken()}&s=`;
  }

  existeCanalPorCodigo(codigo: string) {
    return this.http.get<any>(`${this.url}existe/codigo/${codigo}`,
      this.header.getHeader()
    );
  }

  registrar(canal: Canal) {
    return this.http.post<Canal>(`${this.url}`, canal,
      this.header.getHeader()
    );
  }

  editar(canal: Canal) {
    return this.http.put<Canal>(`${this.url}`, canal,
      this.header.getHeader()
    );
  }

  buscarPorSeccionId(id: number) {
    return this.http.get<Canal[]>(`${this.url}seccionId/${id}`,
      this.header.getHeader()
    );
  }

  listar() {
    return this.http.get<Canal[]>(`${this.url}`,
      this.header.getHeader()
    );
  }

  /**
   * se consultara la informacion del canal por su id
   * @param id 
   */
  buscarPorId(id: number) {
    return this.http.get<Canal>(`${this.url}${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se consultara todo sobre un canal
   * @param id id del canal
   */
  consultaCompleta(id: number) {

    return this.http.get<ConsultaCanal>(`${this.url}consultaCompleta/${id}`,
      this.header.getHeader()
    );
  }

}
