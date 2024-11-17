import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { SignupComponent } from './signup/signup.component';
import { CreateComponent } from './create/create.component';
import { StoryComponent } from './story/story.component';
import { InvitesComponent } from './invites/invites.component';
import { authGuard } from './guards/auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './guards/admin/admin.guard';

export const routes: Routes = [
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login-failed', component: LoginFailedComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'create', component: CreateComponent, canActivate: [authGuard] },
    { path: 'story', component: StoryComponent, canActivate: [authGuard] },
    { path: 'invites', component: InvitesComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
    { path: '', redirectTo: "login", pathMatch: 'full' },
];
