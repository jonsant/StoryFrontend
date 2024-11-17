import { Component, inject } from '@angular/core';
import { InviteeService } from '../services/InviteeService';
import { AcceptInvite, Invitee } from '../models/Invitee';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './invites.component.html',
  styleUrl: './invites.component.scss'
})
export class InvitesComponent {
  inviteeService = inject(InviteeService);
  invites: Invitee[] = [];

  async ngOnInit() {
    await this.GetInvites();
  }

  async AcceptInvite(inviteeId?: string) {
    if (!inviteeId) return;
    let acceptInvite: AcceptInvite = new AcceptInvite();
    acceptInvite.inviteeId = inviteeId;
    await firstValueFrom(this.inviteeService.AcceptInvite(acceptInvite));
    await this.GetInvites();
  }

  async GetInvites() {
    this.invites = await firstValueFrom(this.inviteeService.GetStoryInvites());
  }
}
