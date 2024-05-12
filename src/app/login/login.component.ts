import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoryAuthService } from '../services/StoryAuthService';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  storyAuthService = inject(StoryAuthService);

  constructor(private http: HttpClient, private router: Router) { }

  async ngOnInit() {
    // this.getProfile(environment.msalApiUrl);
    if (await lastValueFrom(this.storyAuthService.GetLoggedInStatus())) this.router.navigate(['home']);
  }

  // private decodeToken(token: string) {
  //   return JSON.parse(atob(token.split(".")[1]));
  // }

  // handleLogin(response: any) {
  //   if (response) {
  //     const payload = this.decodeToken(response.credential);
  //     sessionStorage.setItem("user", JSON.stringify(payload));
  //     this.router.navigate(['home']);
  //   }
  // }
}
