/*              MODULE                                       */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng2CompleterModule } from "ng2-completer";
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';

/*              SERVICE                                       */
import { UnidadService } from './_service/unidad.service';
import { ZonaService } from './_service/zona.service';
import { SeccionService } from './_service/seccion.service';
import { CanalService } from './_service/canal.service';
import { CultivoService } from './_service/cultivo.service';
import { PredioService } from './_service/predio.service';
import { ObraService } from './_service/obra.service';
import { UsuarioService } from './_service/usuario.service';
import { ClimatologiaYearService } from './_service/climatologia-year.service';
import { CultivoPredioService } from './_service/cultivo-predio.service';
import { PlanSiembraService } from './_service/plan-siembra.service';
import { DecadaService } from './_service/decada.service';
import { ConfigService } from './_service/config.service';
import { EstructuraControlService } from './_service/estructura-control.service';
import { EntregaService } from './_service/entrega.service';
import { ManejoAguaService } from './_service/manejo-agua.service';
import { ProgramacionSemanalService } from './_service/programacion-semanal.service';
import { CanalObraService } from './_service/canal-obra.service';
import { DistritoService } from './_service/distrito.service';
import { LoginService } from './_service/login.service';
import { GuardService } from './_service/guard.service';
import { UsersService } from './_service/users.service';

/*              COMPONENT                                       */
import { AppComponent } from './app.component';
import { LoginComponent } from './test/login/login.component';
import { GraficaComponent } from './test/grafica/grafica.component';
import { TablasComponent } from './test/tablas/tablas.component';
import { UnidadComponent } from './componentes/unidad/unidad.component';
import { ZonaComponent } from './componentes/zona/zona.component';
import { SeccionComponent } from './componentes/seccion/seccion.component';
import { CanalComponent } from './componentes/canal/canal.component';
import { PredioComponent } from './componentes//predio/predio.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { CultivoComponent } from './componentes/cultivo/cultivo.component';
import { HeaderComponent } from './header/header.component';
import { ObraComponent } from './componentes/obra/obra.component';
import { ClimatologiaComponent } from './componentes/climatologia/climatologia.component';
import { PlanSiembraComponent } from './componentes/plan-siembra/plan-siembra.component';
import { PlanSiembraInfoComponent } from './componentes/plan-siembra-info/plan-siembra-info.component';
import { BalanceComponent } from './componentes/balance/balance.component';
import { ConfigComponent } from './componentes/config/config.component';
import { EstructuraControlComponent } from './componentes/estructura-control/estructura-control.component';
import { EntregaComponent } from './componentes/entrega/entrega.component';
import { ConsultaEntregaComponent } from './componentes/consulta-entrega/consulta-entrega.component';
import { ManejoAguaRegistrarComponent } from './componentes/manejo-agua-registrar/manejo-agua-registrar.component';
import { ManejoAguaGraficaComponent } from './componentes/manejo-agua-grafica/manejo-agua-grafica.component';
import { ProgramacionSemanalComponent } from './componentes/programacion-semanal/programacion-semanal.component';
import { CalculoQSemanalComponent } from './componentes/calculo-q-semanal/calculo-q-semanal.component';
import { EstablecerCanalesDistribucionComponent } from './componentes/establecer-canales-distribucion/establecer-canales-distribucion.component';
import { EficienciaPerdidasComponent } from './componentes/eficiencia-perdidas/eficiencia-perdidas.component';
import { ConsultaUsuarioComponent } from './componentes/consulta-usuario/consulta-usuario.component';
import { ConsultaPredioComponent } from './componentes/consulta-predio/consulta-predio.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DitribucionAguaMensualComponent } from './componentes/ditribucion-agua-mensual/ditribucion-agua-mensual.component';
import { ConsultaCanalComponent } from './componentes/consulta-canal/consulta-canal.component';
import { CanalObraComponent } from './componentes/canal-obra/canal-obra.component';
import { DistritoComponent } from './componentes/distito/distrito.component';
import { UsersComponent } from './componentes/users/users.component';
import { CambiarClaveComponent } from './componentes/cambiar-clave/cambiar-clave.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GraficaComponent,
    TablasComponent,
    UnidadComponent,
    ZonaComponent,
    SeccionComponent,
    CanalComponent,
    PredioComponent,
    UsuarioComponent,
    CultivoComponent,
    HeaderComponent,
    ObraComponent,
    ClimatologiaComponent,
    PlanSiembraComponent,
    PlanSiembraInfoComponent,
    BalanceComponent,
    ConfigComponent,
    EstructuraControlComponent,
    EntregaComponent,
    ConsultaEntregaComponent,
    ManejoAguaRegistrarComponent,
    ManejoAguaGraficaComponent,
    ProgramacionSemanalComponent,
    CalculoQSemanalComponent,
    EstablecerCanalesDistribucionComponent,
    EficienciaPerdidasComponent,
    ConsultaUsuarioComponent,
    ConsultaPredioComponent,
    DitribucionAguaMensualComponent,
    ConsultaCanalComponent,
    CanalObraComponent,
    DistritoComponent,
    UsersComponent,
    CambiarClaveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    Ng2CompleterModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    AccordionModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    UnidadService,
    ZonaService,
    SeccionService,
    CanalService,
    CultivoService,
    PredioService,
    ObraService,
    UsuarioService,
    ClimatologiaYearService,
    CultivoPredioService,
    PlanSiembraService,
    DecadaService,
    ConfigService,
    EstructuraControlService,
    EntregaService,
    ManejoAguaService,
    ProgramacionSemanalService,
    CanalObraService,
    DistritoService,
    LoginService,
    GuardService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
