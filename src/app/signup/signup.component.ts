import { Component, inject } from '@angular/core';
import { StoryAuthService } from '../services/StoryAuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
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
