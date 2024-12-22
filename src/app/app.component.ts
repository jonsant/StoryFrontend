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
    this.swPush.messages.subscribe(message => {
      console.log(message);
    });

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
