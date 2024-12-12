import { Component, inject } from '@angular/core';
import { InviteeService } from '../services/InviteeService';
import { StoryService } from '../services/StoryService';
import { AcceptInvite, Invitee } from '../models/Invitee';
import { firstValueFrom, Subscribable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './invites.component.html',
  styleUrl: './invites.component.scss'
})
export class InvitesComponent {
  inviteeService = inject(InviteeService);
  storyService = inject(StoryService);
  invites: Invitee[] = [];
  newInvites$?: Subscription;
  router = inject(Router);

  async ngOnInit() {
    await this.GetInvites();
    this.newInvites$ = this.inviteeService.GetNewInviteRecieved().subscribe(ni => {
      if (this.invites.findIndex(i => i.inviteeId === ni.inviteeId) !== -1) return;
      this.invites = [ni, ...this.invites];
    });
  }

  async AcceptInvite(inviteeId?: string) {
    if (!inviteeId) return;
    let acceptInvite: AcceptInvite = new AcceptInvite();
    acceptInvite.inviteeId = inviteeId;
    let response = await firstValueFrom(this.inviteeService.AcceptInvite(acceptInvite));
    if (response !== null && response.storyId) {
      console.log("accept invite response: ", response);
      await this.storyService.SetCurrentStoryId(response.storyId);
      this.router.navigate(['/story']);
    }
    // await this.GetInvites();
  }

  async GetInvites() {
    this.invites = await firstValueFrom(this.inviteeService.GetStoryInvites());
  }
}
