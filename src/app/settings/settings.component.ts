import { Component, inject } from '@angular/core';
import { CurrentUser } from '../models/User';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthenticationService } from '../services/AuthenticationService';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgxDebounceInputDirective } from 'ngx-debounce-input';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../services/UserService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    NgxDebounceInputDirective,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  authenticationService = inject(AuthenticationService);
  currentUser: CurrentUser | null = null;
  currentUserUpdated$?: Subscription;
  changingUsername: boolean = false;
  usernameInput: string = "";
  searchingUsername: boolean = false;
  userService = inject(UserService);
  usernameAvailable?: boolean;
  private _snackBar = inject(MatSnackBar);
  router = inject(Router);

  ngOnInit() {
    this.currentUserUpdated$ = this.authenticationService.getCurrentUserUpdated$().subscribe(v => {
      this.currentUser = this.authenticationService.getCurrentUser();
    });
  }

  UsernameInput() {
    if (this.usernameInput === '') {
      this.searchingUsername = false;
      this.usernameAvailable = undefined;
      return;
    }
    this.searchingUsername = true;
  }

  async CheckUsernameAvailable() {
    if (this.usernameInput === '') return;
    if (this.usernameInput === this.currentUser?.username) {
      this.searchingUsername = false;
      this.usernameAvailable = undefined;
      return;
    }
    this.searchingUsername = true;
    let response = await firstValueFrom(this.userService.UsernameAvailable(this.usernameInput));
    if (response && response === true) {
      this.usernameAvailable = true;
    }
    else if (response === false) {
      this.usernameAvailable = false;
    }
    this.searchingUsername = false;
  }

  async ChangeUsername() {
    if (this.usernameInput === '' || !this.usernameAvailable || this.searchingUsername) return;
    this.changingUsername = true;
    let response = await firstValueFrom(this.userService.ChangeUsername(this.usernameInput));
    if (response === null) {
      this.usernameInput = "";
      this._snackBar.open("Username couldn't be changed", "Close", { duration: 3000 });
    }
    else if (response.userId === this.currentUser?.userId) {
      await this.authenticationService.refreshCurrentUser();
      this._snackBar.open("Username changed!", "Close", { duration: 3000 });
      this.usernameInput = "";
      this.usernameAvailable = undefined;
    }

    this.changingUsername = false;
  }

  Logout() {
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }
}
