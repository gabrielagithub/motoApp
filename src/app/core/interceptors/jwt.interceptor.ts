import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// Para interceptors funcionais (Angular 15+)
export function jwtAuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authToken = authService.getJwtToken();

  // Clona a requisição para adicionar o novo header.
  // Só adiciona o token se ele existir e se a requisição for para a nossa API (exemplo)
  // Poderíamos ter uma lista de URLs que não precisam de token ou uma URL base da API.
  // Por enquanto, vamos adicionar a todas as requisições para simplificar.
  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  // Passa a requisição clonada (ou original) para o próximo handler.
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token inválido ou expirado.
        // Deslogar o usuário e redirecionar para a página de login.
        console.error('Interceptor: Erro 401 - Não autorizado. Deslogando...');
        authService.logout(); // O logout já redireciona para /login
        // router.navigate(['/login'], { queryParams: { returnUrl: req.url } }); // Opcional, se logout não redirecionar
      }
      // Propaga o erro para que outros handlers possam processá-lo.
      return throwError(() => error);
    })
  );
}
