import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './test/login/login.component';
import { GraficaComponent } from './test/grafica/grafica.component';
import { TablasComponent } from './test/tablas/tablas.component';
import { CanalComponent } from './componentes/registrar/canal/canal.component';
import { CultivoComponent } from './componentes/registrar/cultivo/cultivo.component';
import { PredioComponent } from './componentes/registrar/predio/predio.component';
import { SeccionComponent } from './componentes/registrar/seccion/seccion.component';
import { UnidadComponent } from './componentes/registrar/unidad/unidad.component';
import { UsuarioComponent } from './componentes/registrar/usuario/usuario.component';
import { ZonaComponent } from './componentes/registrar/zona/zona.component';


const appRoutes: Routes = [
    { path: 'registrar', children: [
        { path: 'canal', component: CanalComponent},
        { path: 'cultivo', component: CultivoComponent},
        { path: 'predio', component: PredioComponent},
        { path: 'seccion', component: SeccionComponent},
        { path: 'unidad', component: UnidadComponent},
        { path: 'usuario', component: UsuarioComponent},
        { path: 'zona', component: ZonaComponent}
    ]},
    {path: 'login', component: LoginComponent},
    {path: 'grafica', component: GraficaComponent},
    {path: 'tablas', component: TablasComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
    imports : [
        RouterModule.forRoot(appRoutes)
    ],
    exports : [
        RouterModule
    ]
})
export class AppRoutingModule {

}