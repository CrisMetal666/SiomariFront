import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GraficaComponent } from './test/grafica/grafica.component';
import { TablasComponent } from './test/tablas/tablas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GraficaComponent,
    TablasComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
