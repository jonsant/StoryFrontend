import { Component, inject } from '@angular/core';
import { StoryAuthService } from '../services/StoryAuthService';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  authService = inject(StoryAuthService)
  router = inject(Router);
  loggedIn$ = new Subscription();

  async ngOnInit() {
    this.loggedIn$ = this.authService.GetLoggedInStatus().subscribe(s => {
      if (s) this.router.navigate(['home']);
    });
  }

  ngOnDestroy() {
    if (this.loggedIn$) this.loggedIn$.unsubscribe();
  }
}
