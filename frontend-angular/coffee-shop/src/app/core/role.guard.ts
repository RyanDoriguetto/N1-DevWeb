import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Role } from '../shared/models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const allowed = route.data?.['roles'] as Role[] | undefined;

  if (!auth.isAuthenticated) {
    router.navigateByUrl('/login');
    return false;
  }
  if (allowed && (!auth.role || !allowed.includes(auth.role))) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
