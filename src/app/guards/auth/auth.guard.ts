import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../services/AuthenticationService';

export const authGuard: CanActivateFn = (route, state) => {
  let authenticationService = inject(AuthenticationService);
  let router = inject(Router);

  const currentUser = authenticationService.getCurrentUser();
  if (currentUser !== null && currentUser.token !== '') {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
