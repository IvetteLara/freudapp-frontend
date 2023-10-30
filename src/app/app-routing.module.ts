import { PerfilComponent } from './pages/perfil/perfil.component';
import { TokenComponent } from './pages/login/recuperar/token/token.component';
import { RecuperarComponent } from './pages/login/recuperar/recuperar.component';
import { Not404Component } from './pages/not404/not404.component';
import { Not403Component } from './pages/not403/not403.component';
import { GuardService } from './_service/guard.service';
import { LoginComponent } from './pages/login/login.component';
import { OrdenEdicionComponent } from './pages/orden/orden-edicion/orden-edicion.component';
import { OrdenComponent } from './pages/orden/orden.component';
import { ClienteEdicionComponent } from './pages/cliente/cliente-edicion/cliente-edicion.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ProductoEdicionComponent } from './pages/producto/producto-edicion/producto-edicion.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  {
    path: 'orden', component: OrdenComponent, children: [
      { path: 'nuevo', component: OrdenEdicionComponent },
      { path: 'edicion/:id', component: OrdenEdicionComponent }
    ], canActivate: [GuardService]
  },

  { path: 'buscar', component: BuscarComponent, canActivate: [GuardService] },

  {
    path: 'cliente', component: ClienteComponent, children: [
      { path: 'nuevo', component: ClienteEdicionComponent },
      { path: 'edicion/:id', component: ClienteEdicionComponent }
    ], canActivate: [GuardService]
  },

  {
    path: 'producto', component: ProductoComponent, children: [
      { path: 'nuevo', component: ProductoEdicionComponent },
      { path: 'edicion/:id', component: ProductoEdicionComponent }
    ], canActivate: [GuardService]
  },

  {
    path: 'recuperar', component: RecuperarComponent, children: [
      { path: ':token', component: TokenComponent }
    ]
  },
  { path: 'perfil', component: PerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'not-403', component: Not403Component },
  { path: 'not-404', component: Not404Component },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
