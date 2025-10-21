import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const token = localStorage.getItem('access_token');
  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  const allowed = (route.data?.['roles'] as string[] | undefined) ?? undefined;
  const role = (localStorage.getItem('role') || '').toUpperCase();

  if (allowed && !allowed.map(r => r.toUpperCase()).includes(role)) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
