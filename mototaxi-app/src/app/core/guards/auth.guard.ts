import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) { // Usando o signal computado
    return true;
  } else {
    // Redirecionar para a página de login, guardando a URL que o usuário tentou acessar
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
