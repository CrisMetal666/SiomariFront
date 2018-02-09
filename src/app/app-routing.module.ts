import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GraficaComponent } from './test/grafica/grafica.component';
import { TablasComponent } from './test/tablas/tablas.component';


const appRoutes: Routes = [
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