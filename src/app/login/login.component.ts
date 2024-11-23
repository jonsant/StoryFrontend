import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StoryAuthService } from '../services/StoryAuthService';
import { lastValueFrom, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/AuthenticationService';
import { Login } from '../models/Login';
import { Register } from '../models/Register';
import { CurrentUser } from '../models/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authenticationService = inject(AuthenticationService);
  router = inject(Router);
  login$?: Subscription;
  register$?: Subscription;
  currentUser$?: Subscription;
  register = false;
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  async ngOnInit() {
    this.currentUser$ = this.authenticationService.getCurrentUserUpdated$().subscribe(async u => {
      await this.setCurrentUser();
    });

  }

  setCurrentUser() {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser !== null) {
      this.router.navigate(['/home']);
    }
  }

  async loginClicked() {
    this.login$ = this.authenticationService.login(Login.Create(this.email, this.password)).subscribe(result => {
      // console.("lkjfadsljsaölfdkjasölfkjaslfkj!!!!!!!!!!!!!!2");
      if (!result.result || result.token === '') return;
      let user = CurrentUser.Create(
        result.token,
        result.userId,
        result.username,
        result.email,
        result.roles
      );
      this.authenticationService.saveCurrentUser(user);
    });
  }

  registerClicked() {
    if (this.password !== this.confirmPassword) return;
    this.register$ = this.authenticationService.register(Register.Create(this.email, this.password)).subscribe(result => {
      if (!result.result || result.token === '') return;
      let user = CurrentUser.Create(
        result.token,
        result.userId,
        result.username,
        result.email,
        result.roles
      );
      this.authenticationService.saveCurrentUser(user);
    });
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
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

  ngOnDestroy() {
    this.login$ && this.login$.unsubscribe();
    this.register$ && this.register$.unsubscribe();
    this.currentUser$ && this.currentUser$.unsubscribe();
  }
}
