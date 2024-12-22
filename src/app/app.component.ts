import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';
import { UserSignalRService } from './services/UserSignalRService';
import { InviteeService } from './services/InviteeService';
import { CurrentUser } from './models/User';
import { AuthenticationService } from './services/AuthenticationService';
import { SwPush } from '@angular/service-worker';
import { getToken } from '@angular/fire/messaging';
import { getMessaging } from '@firebase/messaging';

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
  swPush = inject(SwPush);

  constructor() {


  }

  ngOnInit(): void {
    this.subscribeToPushNotifications();
    this.requestPermissionToPush();

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

  subscribeToPushNotifications() {
    this.swPush.messages.subscribe(res => {
      console.log(res);
    });
  }

  async requestPermissionToPush() {
    const messaging = getMessaging();
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log("Permission granted");
        const token = await getToken(messaging, { vapidKey: 'BMLd14n3kl1RlvbtvRhUol3f6yON0Bx1dGhOgmWa52h_NK4tNa6HeKmjkoq2C3Ub4NClBBQBzw6w2P0wRhcJgB8' });
        console.log(token);
        // Send token to server and associate with user
      }
      else {
        console.log("Permission denied");
      }
    } catch (error) {
      console.log("Unable to get permission to notify.", error);
    }
  }

  ngOnDestroy(): void {
    this.userSignalRService.stopConnection();
    this.userSignalRService$ && this.userSignalRService$.unsubscribe();
    this.newInvite$ && this.newInvite$.unsubscribe();
  }
}
