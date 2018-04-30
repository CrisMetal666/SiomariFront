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

/*              SERVICE                                       */
import { UnidadService } from './_service/unidad.service';
import { ZonaService } from './_service/zona.service';
import { SeccionService } from './_service/seccion.service';
import { CanalService } from './_service/canal.service';
import { CultivoService } from './_service/cultivo.service';
import { PredioService } from './_service/predio.service';
import { ObraService } from './_service/obra.service';
import { UsuarioService } from './_service/usuario.service';
import { ClimatologiaDatosService } from './_service/climatologia-datos.service';
import { ClimatologiaYearService } from './_service/climatologia-year.service';
import { CultivoPredioService } from './_service/cultivo-predio.service';
import { PlanSiembraService } from './_service/plan-siembra.service';
import { DecadaService } from './_service/decada.service';
import { ConfigService } from './_service/config.service';
import { EstructuraControlService } from './_service/estructura-control.service';

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
    EstructuraControlComponent
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
    BsDatepickerModule.forRoot()
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
    ClimatologiaDatosService,
    ClimatologiaYearService,
    CultivoPredioService,
    PlanSiembraService,
    DecadaService,
    ConfigService,
    EstructuraControlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
