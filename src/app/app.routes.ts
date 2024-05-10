import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MsalGuard } from '@azure/msal-angular';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: 'signup', component: SignupComponent},
    { path: 'login', component: LoginComponent, canActivate: [MsalGuard]},
    { path: 'login-failed', component: LoginFailedComponent},
    { path: 'home', component: HomeComponent, canActivate: [MsalGuard]},
    { path: '', redirectTo: "signup", pathMatch: 'full'},
];
