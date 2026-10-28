import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EconomiaFichasComponent } from './components/economia-fichas/economia-fichas.component';
import { RegistroComponent } from './components/registro/registro.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { CalendarioNinoComponent } from './components/calendario-nino/calendario-nino.component';
import { QuedadasComponent } from './components/quedadas/quedadas.component';
import { authGuard } from './guards/auth.guard';
import { DiarioComponent } from './components/diario/diario.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'calendario',
        component: CalendarioComponent,
        canActivate: [authGuard],
        data: { roles: ['familiar'] }
    },
    {
        path: 'nav',
        component: NavComponent
    },
    {
        path: 'economiaFichas',
        component: EconomiaFichasComponent,
        canActivate: [authGuard],
        data: { roles: ['familiar'] }
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path: 'inicioSesion',
        component: InicioSesionComponent
    },
    {
        path: 'calendario-nino',
        component: CalendarioNinoComponent,
        canActivate: [authGuard],
        data: { roles: ['familiar'] }
    }
    ,
    {
        path: 'footer',
        component: FooterComponent
    },
    {
        path: 'quedadas',
        component: QuedadasComponent,
        canActivate: [authGuard],
        data: { roles: ['familiar', 'comun', 'admin'] }
    },
    {
        path: 'diario',
        component: DiarioComponent,
        canActivate: [authGuard],
        data: { roles: ['familiar'] }

    },
    {
        path: 'admin',
        component:AdminComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    }
]