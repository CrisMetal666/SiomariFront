import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './test/login/login.component';
import { GraficaComponent } from './test/grafica/grafica.component';
import { TablasComponent } from './test/tablas/tablas.component';
import { CanalComponent } from './componentes/canal/canal.component';
import { CultivoComponent } from './componentes/cultivo/cultivo.component';
import { PredioComponent } from './componentes/predio/predio.component';
import { SeccionComponent } from './componentes/seccion/seccion.component';
import { UnidadComponent } from './componentes/unidad/unidad.component';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { ZonaComponent } from './componentes/zona/zona.component';
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
import { DitribucionAguaMensualComponent } from './componentes/ditribucion-agua-mensual/ditribucion-agua-mensual.component';
import { ConsultaCanalComponent } from './componentes/consulta-canal/consulta-canal.component';

const appRoutes: Routes = [
    { path: 'canal/:edicion', component: CanalComponent },
    { path: 'cultivo/:edicion', component: CultivoComponent },
    { path: 'predio/:edicion', component: PredioComponent },
    { path: 'seccion/:edicion', component: SeccionComponent },
    { path: 'unidad/:edicion', component: UnidadComponent },
    { path: 'usuario/:edicion', component: UsuarioComponent },
    { path: 'zona/:edicion', component: ZonaComponent },
    { path: 'obra/:edicion', component: ObraComponent },
    { path: 'climatologia', component: ClimatologiaComponent },
    { path: 'plan-siembra', component: PlanSiembraComponent },
    { path: 'plan-siembra-info', component: PlanSiembraInfoComponent },
    { path: 'balance', component: BalanceComponent },
    { path: 'login', component: LoginComponent },
    { path: 'grafica', component: GraficaComponent },
    { path: 'estructura-control', component: EstructuraControlComponent },
    { path: 'config', component: ConfigComponent },
    { path: 'entrega', component: EntregaComponent },
    { path: 'reporte/caudalServido', component: ConsultaEntregaComponent },
    { path: 'registro-manejo-agua', component: ManejoAguaRegistrarComponent },
    { path: 'registro-manejo-grafica', component: ManejoAguaGraficaComponent },
    { path: 'programacion-semanal', component: ProgramacionSemanalComponent },
    { path: 'calculo-caudal-semanal', component: CalculoQSemanalComponent },
    { path: 'establecer-servidores', component: EstablecerCanalesDistribucionComponent },
    { path: 'eficiencia-perdidas', component: EficienciaPerdidasComponent },
    { path: 'consulta/usuario', component: ConsultaUsuarioComponent },
    { path: 'consulta/predio', component: ConsultaPredioComponent },
    { path: 'distribucion-agua-mensual', component: DitribucionAguaMensualComponent },
    { path: 'consulta/canal', component: ConsultaCanalComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}