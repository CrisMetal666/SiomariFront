import { Component, OnInit, TemplateRef } from '@angular/core';
import { CompleterData, CompleterService, CompleterItem } from 'ng2-completer';
import { PredioService } from '../../_service/predio.service';
import { CultivoService } from '../../_service/cultivo.service';
import { Predio } from '../../_model/predio';
import { Cultivo } from '../../_model/cultivo';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CultivoPredioService } from '../../_service/cultivo-predio.service';
import { CultivoPredio } from '../../_model/cultivo-predio';
import { PlanSiembra } from '../../_model/plan-siembra';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PlanSiembraService } from '../../_service/plan-siembra.service';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-plan-siembra',
  templateUrl: './plan-siembra.component.html',
  styleUrls: ['./plan-siembra.component.css']
})
export class PlanSiembraComponent implements OnInit {

  public fecha: Date = new Date();
  //lista donde se guardan los cultivoPredio listados o agregados
  public lstCultivoPredio: CultivoPredio[];
  //lista que guarda los id de cultivoPredio que se van a eliminar cuando se guarde los cambios
  private lstIdEliminar: number[];
  //hectareas del cultivoPredio
  public hectarea: number;
  //id del cultivoPredio, se usa en el modal de edicion
  private idCultivoPredio: number;
  //id del plan siembra
  private idPlanSiembra: number;
  //guardara la posicion del elemento que se va a editar
  private indexLstCanalPredio: number;
  // estados para mostrar mensajes al usuario
  public estado: number;
  //se guardara el objeto seleccionado en el auto-completer de predio
  public predio: Predio;
  //se guardara el objeto seleccionado en el auto-completer de cultivo
  public cultivo: Cultivo;
  //valor que se usara para verificar si las hectareas ingredas no sean mayor que el area del predio
  public hectareaValid: boolean;
  //valor necesario para comprobar si ya se realizo la busqueda del plan de siembra
  public verificado: boolean;
  //sera true si se esta editando un cultivoPredio, false si se esta agregando
  private editando: boolean;
  //auto-completer
  public searchPredio: string;
  public searchCultivo: string;
  public dataServicePredio: CompleterData;
  public dataServiceCultivo: CompleterData;
  //modal
  private modalRef: BsModalRef;
  // se asignara el titulo al modal, si es para editar o agregar
  public tituloModal: string;
  /* 
   * sumatoria de las hectareas que sirven para mostrar al usuario si van a sembrar mas hectareas
   * de la que tiene el predio
  */
  private sumHectareas: number;

  constructor(
    private completerService: CompleterService,
    private predioService: PredioService,
    private cultivoService: CultivoService,
    private spinnerService: Ng4LoadingSpinnerService,
    private cultivoPredioService: CultivoPredioService,
    private modalService: BsModalService,
    private planSiembraService: PlanSiembraService,
    private _localeService: BsLocaleService
  ) {    
  }

  ngOnInit() {
    //definimos el idioma del datepicker
    defineLocale('es', esLocale);
    this._localeService.use('es');
    //inicializamos los autocompleter
    this.dataServicePredio = this.completerService.remote(this.predioService.urlBuscarIdCodigoNombrePorNombreOCodigo,'codigo,nombre', 'nombre');
    this.dataServiceCultivo = this.completerService.remote(this.cultivoService.urlBuscarIdNombrePorNombre, 'nombre', 'nombre');

    this.resetVariables();
  }

  /**
   * guardamos el objeto seleccionado o dejamos nulo si no seleccionaron 
   */
  onPredioSelect(selected: CompleterItem) {
    if (selected) {
      this.predio = new Predio();
      this.predio.id = selected.originalObject.id;
      this.predio.areaTotal = selected.originalObject.areaTotal;
    } else {
      this.predio = null;
    }
  }

  /**
   * guardamos el objeto seleccionado o dejamos nulo si no seleccionaron 
   */
  onCultivoSelect(selected: CompleterItem) {
    if (selected) {
      this.cultivo = new Cultivo();
      this.cultivo.id = selected.originalObject.id;
      this.cultivo.nombre = selected.originalObject.nombre;
    } else {
      this.cultivo = null;
    }
  }

  /**
  * verificara que la suma area escrita no sea mayor que el area
  * del predio, si es valido, se le asigna true a la variable hectareaValid, si no es valido
  * se le asignara false
  * @param editando true si se estan en fase de edicion, false si esta en fase de agregar
  */
  validarHectareas() {

    //le asignamos el area seleccionada por el usuario
    let sumHectareas = this.hectarea;

    if (!this.editando) {
      //sumamos las demas areas
      this.lstCultivoPredio.forEach(cp => sumHectareas += cp.hectareas);
    } else {
      //sumamos las areas menos la que se esta editando
      this.lstCultivoPredio.forEach((cp, i) => {
        if (i != this.indexLstCanalPredio) sumHectareas += cp.hectareas;
      });
    }

    //verificamos que el area del predio sea valida
    if (this.predio.areaTotal < sumHectareas) {
      this.hectareaValid = false;
    } else {
      this.hectareaValid = true;
    }
  }

  //consultamos la informacion segun el predio seleccionado y la fecha
  onClickBuscar() {

    this.spinnerService.show();

    //primero consultamos el id del plan de siembra
    this.planSiembraService.buscarIdPorYearMesPeriodo(this.fecha).subscribe(res => {

      this.idPlanSiembra = res.id;

      this.cultivoPredioService.buscarPorPredioIdPlanSiembraId(this.predio.id, this.idPlanSiembra)
        .subscribe(res => {

          this.lstCultivoPredio = res;

          //asignamos el id del predio, ya que vienen sin este del servidor
          this.lstCultivoPredio.forEach(cp => {
            let predio = new Predio();
            predio.id = this.predio.id;
            cp.predioId = predio;
          });

          this.validarHectareas();

          this.verificado = true;
          this.spinnerService.hide();
        }, err => {
          this.estado = 0;
          this.spinnerService.hide();
        });
    });

  }

  /**
   * borramos los datos que existen para seguir con uno nuevo
   */
  onClickCancelar() {
    this.verificado = false;
    this.resetVariablesModal();
  }

  onClickAceptar() {

    //verificamos que la suma de las hectareas sea valida
    this.validarHectareas();

    //si las hectareas no son validas salimos del metodo
    if (!this.hectareaValid) return;

    //llenamos el objeto con los valores que seleccionaron en el modal
    let cultivoPredio = new CultivoPredio();
    let planSiembra = new PlanSiembra();
    let cultivo = new Cultivo();
    let predio = new Predio();

    planSiembra.id = this.idPlanSiembra;
    cultivo.id = this.cultivo.id;
    cultivo.nombre = this.cultivo.nombre;
    predio.id = this.predio.id;

    cultivoPredio.cultivoId = cultivo;
    cultivoPredio.predioId = predio;
    cultivoPredio.planSiembraId = planSiembra;
    cultivoPredio.hectareas = this.hectarea;

    //si esta editando reemplazamos el objeto, si no, agregamos uno nuevo
    if (this.editando) {
      cultivoPredio.id = this.idCultivoPredio;
      this.lstCultivoPredio[this.indexLstCanalPredio] = cultivoPredio;
    } else {
      this.lstCultivoPredio.push(cultivoPredio);
    }

    this.modalRef.hide();
  }


  onClickEditar(template: TemplateRef<any>, index: number) {

    //se necesita espeficar si se esta editando o no
    this.editando = true;

    //guardamos la posicion del objeto en la lista
    this.indexLstCanalPredio = index;

    //limpiamos los valores que se usan en el modal
    this.resetVariablesModal();

    //asignamos los valores que se mostraran en el modal
    let cultivoPredio = this.lstCultivoPredio[index];

    this.searchCultivo = cultivoPredio.cultivoId.nombre;
    this.cultivo = cultivoPredio.cultivoId;
    this.hectarea = cultivoPredio.hectareas;
    this.idCultivoPredio = cultivoPredio.id;

    //le damos un titulo al modal
    this.tituloModal = 'Editar plan de siembra';

    //mostramos el modal
    this.modalRef = this.modalService.show(template);
  }

  /**
   * abrirmos el modal para agregar un nuevo cultivo en la lista lstCultivoPredio  
   */
  onClickAgregar(template: TemplateRef<any>) {

    //se necesita espeficar si se esta editando o no
    this.editando = false;

    //limpiamos los valores que se usan en el modal
    this.resetVariablesModal();

    //le damos un titulo al modal
    this.tituloModal = 'Agregar plan de siembra';

    //mostramos el modal
    this.modalRef = this.modalService.show(template);
  }

  // eliminamos de la lista y guardamos el id para que al momemto de confirmar eliminarlos
  onClickEliminar(index: number) {

    /*
     * verificamos que el objeto eliminado ya existe en la base de datos y no enviar ids nulos
     * al servidor
     */ 
    if(this.lstCultivoPredio[index].id > 0) {
      this.lstIdEliminar.push(this.lstCultivoPredio[index].id);
    }
    this.lstCultivoPredio.splice(index, 1);
  }

  registrar(form) {

    this.spinnerService.show();

    this.lstCultivoPredio.forEach(xp => xp.idsEliminar = this.lstIdEliminar);

    this.cultivoPredioService.guardarLista(this.lstCultivoPredio).subscribe(res => {

      this.estado = 1;
      form.reset();
      this.resetVariables();
      this.spinnerService.hide();

    }, err => {
      this.estado = 0;
      this.spinnerService.hide();
    });

  }

  resetVariables() {
    this.predio = null;
    this.searchPredio = '';
    this.hectareaValid = false;
    this.verificado = false;
    this.idPlanSiembra = undefined;
    this.editando = false;
    this.lstIdEliminar = [];
    this.resetVariablesModal();
  }

  //limpiamos las variables usadas en el modal
  resetVariablesModal() {
    this.hectarea = undefined;
    this.idCultivoPredio = undefined;
    this.cultivo = null;
    this.searchCultivo = undefined;
  }
}
