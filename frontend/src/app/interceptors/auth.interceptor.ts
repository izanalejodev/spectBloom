import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Añadir token
 if (
  token &&
  !req.url.includes('/login') &&
  !req.url.includes('/register') &&
  !req.url.includes('api.openalex.org') &&
  !req.url.includes('wikipedia.org') &&
  !req.url.includes('/ai/chat')
) {
  req = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
}

  // NUEVO: Manejar errores 401
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.clearSession();
        router.navigate(['/home']);
      }
      return throwError(() => error);
    })
  );
};