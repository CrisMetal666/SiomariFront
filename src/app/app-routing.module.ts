import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { GraficaComponent } from './test/grafica/grafica.component';
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
import { CanalObraComponent } from './componentes/canal-obra/canal-obra.component';
import { DistritoComponent } from './componentes/distito/distrito.component';
import { UsersComponent } from './componentes/users/users.component';
import { GuardService } from './_service/guard.service';
import { CambiarClaveComponent } from './componentes/cambiar-clave/cambiar-clave.component';
import { DivoperComponent } from './componentes/divoper/divoper.component';
import { TablasComponent } from './test/tablas/tablas.component';

const appRoutes: Routes = [
    { path: 'canal/:edicion', component: CanalComponent, canActivate: [ GuardService ] },
    { path: 'cultivo/:edicion', component: CultivoComponent, canActivate: [ GuardService ] },
    { path: 'predio/:edicion', component: PredioComponent, canActivate: [ GuardService ] },
    { path: 'seccion/:edicion', component: SeccionComponent, canActivate: [ GuardService ] },
    { path: 'unidad/:edicion', component: UnidadComponent, canActivate: [ GuardService ] },
    { path: 'usuario/:edicion', component: UsuarioComponent, canActivate: [ GuardService ] },
    { path: 'zona/:edicion', component: ZonaComponent, canActivate: [ GuardService ] },
    { path: 'obra/:edicion', component: ObraComponent, canActivate: [ GuardService ] },
    { path: 'climatologia', component: ClimatologiaComponent, canActivate: [ GuardService ] },
    { path: 'plan-siembra', component: PlanSiembraComponent, canActivate: [ GuardService ] },
    { path: 'plan-siembra-info', component: PlanSiembraInfoComponent, canActivate: [ GuardService ] },
    { path: 'balance', component: BalanceComponent, canActivate: [ GuardService ] },
    { path: 'login', component: LoginComponent },
    { path: 'grafica', component: GraficaComponent, canActivate: [ GuardService ] },
    { path: 'estructura-control', component: EstructuraControlComponent, canActivate: [ GuardService ] },
    { path: 'config', component: ConfigComponent, canActivate: [ GuardService ] },
    { path: 'entrega', component: EntregaComponent, canActivate: [ GuardService ] },
    { path: 'reporte/caudalServido', component: ConsultaEntregaComponent, canActivate: [ GuardService ] },
    { path: 'registro-manejo-agua', component: ManejoAguaRegistrarComponent, canActivate: [ GuardService ] },
    { path: 'manejo-agua-grafica', component: ManejoAguaGraficaComponent, canActivate: [ GuardService ] },
    { path: 'programacion-semanal', component: ProgramacionSemanalComponent, canActivate: [ GuardService ] },
    { path: 'calculo-caudal-semanal', component: CalculoQSemanalComponent, canActivate: [ GuardService ] },
    { path: 'establecer-servidores', component: EstablecerCanalesDistribucionComponent, canActivate: [ GuardService ] },
    { path: 'eficiencia-perdidas', component: EficienciaPerdidasComponent, canActivate: [ GuardService ] },
    { path: 'consulta/usuario', component: ConsultaUsuarioComponent, canActivate: [ GuardService ] },
    { path: 'consulta/predio', component: ConsultaPredioComponent, canActivate: [ GuardService ] },
    { path: 'distribucion-agua-mensual', component: DitribucionAguaMensualComponent, canActivate: [ GuardService ] },
    { path: 'consulta/canal', component: ConsultaCanalComponent, canActivate: [ GuardService ] },
    { path: 'agregar-obra', component: CanalObraComponent, canActivate: [ GuardService ] },
    { path: 'distrito', component: DistritoComponent, canActivate: [ GuardService ] },
    { path: 'cuenta/:edicion', component: UsersComponent, canActivate: [ GuardService ] },
    { path: 'cambiar-clave', component: CambiarClaveComponent, canActivate: [ GuardService ] },
    { path: 'consulta/divoper', component: DivoperComponent, canActivate: [ GuardService ] },
    { path: 'test/tabla', component: TablasComponent },
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