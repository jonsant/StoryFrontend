import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from './navbar/navbar.component';
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';
import { UserSignalRService } from './services/UserSignalRService';
import { InviteeService } from './services/InviteeService';

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

  ngOnInit(): void {
    console.log(environment.testvar);

    this.userSignalRService$ = this.userSignalRService.startConnection().subscribe(() => {
      this.newInvite$ = this.userSignalRService.NewInvite().subscribe(newInvite => {
        this.inviteeService.SetNewInviteRecieved(newInvite);
      });
    });
  }

  ngOnDestroy(): void {
    this.userSignalRService.stopConnection();
    this.userSignalRService$ && this.userSignalRService$.unsubscribe();
    this.newInvite$ && this.newInvite$.unsubscribe();
  }
}
