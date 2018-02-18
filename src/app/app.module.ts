import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { LoginComponent } from './test/login/login.component';
import { GraficaComponent } from './test/grafica/grafica.component';
import { TablasComponent } from './test/tablas/tablas.component';
import { UnidadComponent } from './componentes/registrar/unidad/unidad.component';
import { ZonaComponent } from './componentes/registrar/zona/zona.component';
import { SeccionComponent } from './componentes/registrar/seccion/seccion.component';
import { CanalComponent } from './componentes/registrar/canal/canal.component';
import { PredioComponent } from './componentes/registrar/predio/predio.component';
import { UsuarioComponent } from './componentes/registrar/usuario/usuario.component';
import { CultivoComponent } from './componentes/registrar/cultivo/cultivo.component';
import { HeaderComponent } from './header/header.component';

import { UnidadService } from './_service/unidad.service';
import { ZonaService } from './_service/zona.service';
import { SeccionService } from './_service/seccion.service';
import { CanalService } from './_service/canal.service';

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
    HeaderComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  providers: [
    UnidadService,
    ZonaService,
    SeccionService, 
    CanalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
