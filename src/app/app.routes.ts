import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { MapViewComponent } from './features/map/map-view/map-view.component';
import { HistoryViewComponent } from './features/history/history-view/history-view.component'; // Importar HistoryViewComponent
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

import { authGuard } from './core/guards/auth.guard';
import { AuthService } from './core/services/auth.service';


// Guarda para redirecionamento da rota raiz
const rootRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return router.parseUrl('/app/home'); // Redireciona para a rota principal dentro do layout
  }
  return router.parseUrl('/login'); // Redireciona para login se não autenticado
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [rootRedirectGuard],
    pathMatch: 'full',
    // Não precisa de componente aqui, pois o guarda sempre redirecionará
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'app', // Rota base para o layout principal
    component: MainLayoutComponent,
    canActivate: [authGuard], // Protege todo o layout e suas filhas
    children: [
      { path: 'home', component: MapViewComponent },
      { path: 'history', component: HistoryViewComponent },
      // Outras rotas que usarão o MainLayoutComponent virão aqui
      // Ex: { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' } // Redireciona /app para /app/home
    ]
  },
  // Adicionar um fallback para rotas não encontradas, se desejado
  // { path: '**', redirectTo: '' } // Pode redirecionar para /login ou uma página 404
];
