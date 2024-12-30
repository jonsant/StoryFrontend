import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../environments/environment';
import { firstValueFrom, Subscription } from 'rxjs';
import { UserSignalRService } from './services/UserSignalRService';
import { InviteeService } from './services/InviteeService';
import { CurrentUser } from './models/User';
import { AuthenticationService } from './services/AuthenticationService';
import { SwPush } from '@angular/service-worker';
import { getToken, Messaging } from '@angular/fire/messaging';
import { PushNotificationService } from './services/PushNotificationService';
import { AddUserPushNotificationToken } from './models/PushNotification';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    NavbarComponent
  ]
})
export class AppComponent {
  title = 'StoryFrontend';
  userSignalRService$?: Subscription;
  newInvite$?: Subscription;
  userSignalRService = inject(UserSignalRService);
  inviteeService = inject(InviteeService);
  currentUser: CurrentUser | null = null;
  currentUserUpdated$?: Subscription;
  authenticationService = inject(AuthenticationService);
  pushNotificationService = inject(PushNotificationService);

  ngOnInit(): void {
    this.currentUserUpdated$ = this.authenticationService.getCurrentUserUpdated$().subscribe(v => {
      this.currentUser = this.authenticationService.getCurrentUser();
      if (this.currentUser === null) return;

      this.userSignalRService$ = this.userSignalRService.startConnection().subscribe(() => {
        this.newInvite$ = this.userSignalRService.NewInvite().subscribe(newInvite => {
          this.inviteeService.SetNewInviteRecieved(newInvite);
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.userSignalRService.stopConnection();
    this.userSignalRService$ && this.userSignalRService$.unsubscribe();
    this.newInvite$ && this.newInvite$.unsubscribe();
  }
}
