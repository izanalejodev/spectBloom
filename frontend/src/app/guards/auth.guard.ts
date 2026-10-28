import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const authGuard = (route: any) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // No logueado
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }

  const user = authService.getUser();
  const allowedRoles = route.data?.roles;

  // Si la ruta tiene restricción de roles
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return router.createUrlTree(['/home']); // o donde quieras
  }

  return true;
};