import { Injectable } from '@angular/core';
import { url } from './var.const';
import { Predio } from '../_model/predio';
import { HttpClient } from '@angular/common/http';
import { HeaderToken } from './header-token';

@Injectable()
export class PredioService {

  private url: string;
  //Se usara en los autocompleter
  public urlBuscarIdCodigoNombrePorNombreOCodigo: string;
  public urlBuscarIdCodigoNombrePorNombreOCodigoSinUsuarios: string;
  // objeto que contrira el header de autorizacion
  private header: HeaderToken;

  constructor(
    private http: HttpClient
  ) {
    this.url = `${url}predio/`;
    this.header = new HeaderToken();
    this.urlBuscarIdCodigoNombrePorNombreOCodigo = `${this.url}nombreOCodigo?access_token=${this.header.getToken()}&s=`;
    this.urlBuscarIdCodigoNombrePorNombreOCodigoSinUsuarios = `${this.url}sinUsuarios?access_token=${this.header.getToken()}&s=`;
    this.urlGetPlano = `${this.url}getPlano?access_token=${this.header.getToken()}&name=`;
  }

  registrar(predio: Predio) {
    return this.http.post<Predio>(`${url}predio`, predio,
      this.header.getHeader()
    );
  }

  editar(predio: Predio) {
    return this.http.put<Predio>(`${url}predio`, predio,
      this.header.getHeader()
    );
  }

  /**
   * se buscara un predio por su codigo
   * @param codigo 
   * @returns true si existe el predio, false si no existe
   */
  existePorCodigo(codigo: string) {
    return this.http.get<any>(`${this.url}existe/codigo/${codigo}`,
      this.header.getHeader()
    );
  }

  /**
   * se listaran todos los predios que no tengan un usuario registrado
   * @returns lista de predios
   */
  listarSinUsuarios() {
    return this.http.get<Predio[]>(`${this.url}sinUsuarios`,
      this.header.getHeader()
    );
  }

  /**
   * se listaran todos los predios
   * @returns los predios solo tendran el id, nombre, codigo y areatotal
   */
  datosBasicos() {
    return this.http.get<Predio[]>(`${this.url}datosBasicos`,
      this.header.getHeader()
    );
  }

  /**
   * se listaran los predios donde en el nombre o codigo contangan la cadena especificada
   * @param query cadena de consulta
   * @returns lista de predios con solo el id, codigo y nombre
   */
  listarIdCodigoNombrePorNombreOCodigo(query: string) {
    return this.http.get<Predio[]>(`${this.url}nombreOCodigo?s=${query}`,
      this.header.getHeader()
    );
  }

  /**
   * se buscara el predio por su id
   * @param id 
   * @returns predio con toda su informacion
   */
  buscarPorId(id: number) {
    return this.http.get<Predio>(`${this.url}${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se buscaran las coordenadas de un predio por su id
   * @param id id del predio
   */
  buscarCoordenadasPorId(id: number) {

    return this.http.get<Predio>(`${this.url}coordenadas/${id}`,
      this.header.getHeader()
    );
  }

  /**
   * se guardara la informacion enviada
   * @param predio informacion a registrar
   * @param file plano a guardar
   */
  guardar(predio: Predio, file: File) {

    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('body', JSON.stringify(predio));

    return this.http.post<number>(`${this.url}`, formdata,
      this.header.getHeaderSendFile()
    );
  }

  /**
   * se traeran los bytes del plano predial
   * @param nombre nombre del plano
   */
  getPlano(nombre: string) {
    return this.http.get(`${this.url}getPlano?name=${nombre}`,
      {
        responseType: 'blob',
        headers: this.header.header()
      });
  }

  public urlGetPlano: string;
}
