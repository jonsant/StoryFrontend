import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../services/AuthenticationService';

export const adminGuard: CanActivateFn = (route, state) => {
  let authenticationService = inject(AuthenticationService);
  let router = inject(Router);

  const currentUser = authenticationService.getCurrentUser();
  if (currentUser !== null && currentUser.roles.includes('Admin')) {
    return true;
  }
  router.navigate(['/home']);
  return false;
};
