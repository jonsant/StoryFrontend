import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@microsoft/signalr';
import { AuthenticationService } from '../services/AuthenticationService';
import { firstValueFrom } from 'rxjs';
import { ResetPasswordEmailRequest } from '../models/ResetPassword';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent {
  token: string | null = null;
  route = inject(ActivatedRoute);
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  authenticationService = inject(AuthenticationService);
  result?: string;
  requestEmail: boolean = true;

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token === null) return;
    if (this.token !== 'email') {
      this.requestEmail = false;
      this.token = atob(this.token);
      console.log(this.token);
    }
  }

  async resetPasswordClicked() {
    if (this.token === null || this.token === '') return;
    if (this.password !== this.confirmPassword) return;
    let response = await firstValueFrom(this.authenticationService.resetPassword(this.email, this.password, this.token));
    if (response === null || response.email !== this.email) {
      this.result = "Failed resetting password";
    }
    else {
      this.result = "Password was reset!";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
    }
  }

  async resetPasswordEmailClicked() {
    if (this.email === '') return;
    let response = await firstValueFrom(this.authenticationService.resetPasswordEmailRequest(ResetPasswordEmailRequest.Create(this.email)));
    if (response === null || response.email !== this.email) {
      this.result = "Request failed. Try again";
    }
    else {
      this.result = "Check your inbox for reset link";
      this.email = "";
    }
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
