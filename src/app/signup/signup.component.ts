import { Component, inject } from '@angular/core';
import { StoryAuthService } from '../services/StoryAuthService';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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

  ngOnInit() {
    if (this.authService.IsLoggedIn()) {
      this.router.navigate(['home']);
    }
    console.log(this.authService.IsLoggedIn());
  }
}
