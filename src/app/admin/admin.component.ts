import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from '../services/AdminService';
import { AddEmail } from '../models/Admin';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private _snackBar = inject(MatSnackBar);
  adminService = inject(AdminService);
  emailWhiteListInput: string = "";
  addingToWhitelist: boolean = false;

  async AddEmailToWhitelistClicked() {
    if (this.emailWhiteListInput === '') return;
    this.addingToWhitelist = true;
    // try {
    let response = await firstValueFrom(this.adminService.AddEmail(AddEmail.Create(this.emailWhiteListInput)));
    // console.log("reeesepon ", response);
    if (response.email.toLowerCase() === this.emailWhiteListInput.toLowerCase()) {
      this._snackBar.open("Email added", "Close", { duration: 3000 });
    }
    else if (response.email === 'exists') {
      this._snackBar.open("Email is already whitelisted", "Close", { duration: 3000 });
    }
    else {
      this._snackBar.open("Email couldn't be added", "Close", { duration: 3000 });
    }
    // } catch (ex) {
    // }
    this.emailWhiteListInput = '';
    this.addingToWhitelist = false;
  }
}
