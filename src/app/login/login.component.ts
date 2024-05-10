import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { StoryAuthService } from '../services/StoryAuthService';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  profile: ProfileType | undefined;
  storyAuthService = inject(StoryAuthService);

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // this.getProfile(environment.apiConfig.uri);
    if (this.storyAuthService.IsLoggedIn()) this.router.navigate(['home']);
  }

  getProfile(url: string) {
    this.http.get(url)
      .subscribe(profile => {
        this.profile = profile;
      });
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
