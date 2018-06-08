import { Component, OnInit, TemplateRef } from '@angular/core';
import { ClimatologiaDatos } from '../../_model/climatologia-datos';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ClimatologiaYear } from '../../_model/climatologia-year';
import { ClimatologiaYearService } from '../../_service/climatologia-year.service';
import { DecadaService } from '../../_service/decada.service';
import { Decada } from '../../_model/decada';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-climatologia',
  templateUrl: './climatologia.component.html',
  styleUrls: ['./climatologia.component.css']
})
export class ClimatologiaComponent implements OnInit {

  //informacion que contiene la que se mostrara en el modal
  public climatologiaDatos: ClimatologiaDatos;
  //año en el cual se va a registrar los datos
  public year: number;
  //mes en el que se registrara los datos
  public mes: number;
  //se guardara el estado para mostrar al usuario
  public estado: number;
  //auto-completer
  public searchMes: string;
  public dataServiceMes: CompleterData;
  public meses: any[] = [
    { index: 1, mes: "Enero" },
    { index: 2, mes: "Febrero" },
    { index: 3, mes: "Marzo" },
    { index: 4, mes: "Abril" },
    { index: 5, mes: "Mayo" },
    { index: 6, mes: "Junio" },
    { index: 7, mes: "Julio" },
    { index: 8, mes: "Agosto" },
    { index: 9, mes: "Septiembre" },
    { index: 10, mes: "Octubre" },
    { index: 11, mes: "Noviembre" },
    { index: 12, mes: "Diciembre" }
  ];
  // guardara la informacion que se consulta
  private decada: Decada;
  //obejto que se almacena la referencia del modal 
  private modalRef: BsModalRef;
  // index de la decada que se este viendo en el modal
  private decadaModal: number;

  constructor(
    private completerService: CompleterService,
    private climatologiaYearService: ClimatologiaYearService,
    private spinnerService: Ng4LoadingSpinnerService,
    private decadaService: DecadaService,
    private modalService: BsModalService
  ) {
    this.year = new Date().getFullYear();
    this.dataServiceMes = this.completerService.local(this.meses, 'mes,index', 'mes');
  }

  ngOnInit() {
    this.resetVariables();
  }

  //se buscara la informacion segun el año y mes especificado
  onMesSelect(selected: CompleterItem) {

    this.resetVariables();

    if (selected) {
      this.mes = selected.originalObject.index;

      this.spinnerService.show();

      this.decadaService.datosPorMesYYear(this.mes, this.year).subscribe(res => {

        this.spinnerService.hide();

        if (res.id != 0) {
          this.decada = res;
        }

      }, err => {
        this.estado = 0;
        this.spinnerService.hide();
      });
    } else {
      this.mes = 0;
    }
  }

  /**
   * prepararemos la decada para mostrar su informacion en el modal para ser modificada
   * @param index especifica si es la primera, segunda, tercera etapa
   * @param template modal que se va a mostrar
   * @param form formulario del modal
   */
  onClickVer(index:number, template: TemplateRef<any>) {

    //guardamos que decada se esta viendo en el modal
    this.decadaModal = index;

    //inicializamos el objeto segun la decasa dicha para observalo en el modal
    if(index == 1) {

      this.climatologiaDatos = this.inicializarClimatologiaDatos(this.decada.decada1);

    } else if(index == 2) {

      this.climatologiaDatos = this.inicializarClimatologiaDatos(this.decada.decada2);

    } else if(index == 3) {

      this.climatologiaDatos = this.inicializarClimatologiaDatos(this.decada.decada3);

    }

    //mostramos el modal
    this.modalRef = this.modalService.show(template);
    
  }

  /**
   * necesario trabasar la informacion de un objeto a otro nuevo para no tener errores de 
   * asignacion por referencia
   * @param datos infromacion de la decada
   */
  inicializarClimatologiaDatos(datos: ClimatologiaDatos): ClimatologiaDatos {

    if(datos == null) {
      return new ClimatologiaDatos();
    }

    let climatigaDatos = new ClimatologiaDatos();
    climatigaDatos.id = datos.id;
    climatigaDatos.evaporacion = datos.evaporacion;
    climatigaDatos.precipitacion = datos.precipitacion;
    climatigaDatos.qPrecipitacion = datos.qPrecipitacion;

    return climatigaDatos;
  }


  onClickAceptar() {

    //guardamos la informacion segun la decada que se habia seleccionado
    if(this.decadaModal == 1) {

      this.decada.decada1 = this.climatologiaDatos;

    } else if(this.decadaModal == 2) {

      this.decada.decada2 = this.climatologiaDatos;
      
    } else if(this.decadaModal == 3) {

      this.decada.decada3 = this.climatologiaDatos;
      
    }

    //ocultamos el modal
    this.modalRef.hide();
  }

  //evento ngsubmit. Guardara los datos
  registrar(form) {

    this.spinnerService.show();

    /*
    * buscamos si ya tenia datos registrados para no sobre escribir la informacion y borrarla
    * ya que si no se consultan, los demas meses que no se vayan a registrar en este momento
    * quedaran nulos porque se realiza una actualizacion en cascada
    */
    this.climatologiaYearService.buscarPorId(this.year).subscribe(res => {

      let climatologiaYear: ClimatologiaYear = res;

      if (this.mes == 1) {
        climatologiaYear.enero = this.decada;
      } else if (this.mes == 2) {
        climatologiaYear.febrero = this.decada;
      } else if (this.mes == 3) {
        climatologiaYear.marzo = this.decada;
      } else if (this.mes == 4) {
        climatologiaYear.abril = this.decada;
      } else if (this.mes == 5) {
        climatologiaYear.mayo = this.decada;
      } else if (this.mes == 6) {
        climatologiaYear.junio = this.decada;
      } else if (this.mes == 7) {
        climatologiaYear.julio = this.decada;
      } else if (this.mes == 8) {
        climatologiaYear.agosto = this.decada;
      } else if (this.mes == 9) {
        climatologiaYear.septiembre = this.decada;
      } else if (this.mes == 10) {
        climatologiaYear.octubre = this.decada;
      } else if (this.mes == 11) {
        climatologiaYear.noviembre = this.decada;
      } else if (this.mes == 12) {
        climatologiaYear.diciembre = this.decada;
      } else {
        this.estado = 0;
        this.spinnerService.hide();
        return;
      }

      if(climatologiaYear.year == 0) {
        climatologiaYear.year = this.year;
      }

      this.climatologiaYearService.guardar(climatologiaYear).subscribe(res => {

        this.spinnerService.hide();
        this.estado = 1;
        this.resetVariables();
        form.reset();
        

      }, err => {
        this.spinnerService.hide();
        this.estado = 0;
      });

    }, err => {
      this.spinnerService.hide();
      this.estado = 0;
    });

  }

  //inicializamos las variables
  resetVariables() {
    this.climatologiaDatos = new ClimatologiaDatos();
    this.mes = undefined;
    this.decada = new Decada();
  }
} 
