import { Component, inject } from '@angular/core';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { Subscription, firstValueFrom, lastValueFrom } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LobbyMessage } from '../models/LobbyMessage';
import { LobbyMessageService } from '../services/LobbyMessageService';
import { User } from '../models/User';
import { UserService } from '../services/UserService';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent {
  storyService = inject(StoryService);
  story?: Story;
  status: string = "";
  messageInputValue: string = "";
  lobbyMessages: LobbyMessage[] = [];
  lobbyMessageService = inject(LobbyMessageService);
  userService = inject(UserService);
  currentUser?: User;
  currentUser$?: Subscription;
  // participants: string[] = [];

  async ngOnInit() {
    this.currentUser$ = this.userService.GetCurrentUser().subscribe(u => {
      this.currentUser = u;
    });
    let lb = new LobbyMessage();
    lb.message = "starta nu då!!!!! annars klår jag upp er allihopa! okej? capish?";
    lb.username = "story-user-slkjfslfaj";
    await this.GetStory();
    await this.GetLobbyMessages();

    switch (this.story?.status) {
      case "Created": this.status = "Väntar på start";
        break;
      case "Active": this.status = "Pågår";
        break;
      case "Finished": this.status = "Avslutad";
        break;
      default: "";
    }
  }

  async GetStory() {
    const id = sessionStorage.getItem("currentStoryId");
    if (!id) return;
    let response = await lastValueFrom(this.storyService.GetStoryById(id));
    this.story = response;
  }

  async GetLobbyMessages() {
    if (this.story?.status !== 'Created') return;
    if (!this.story.storyId) return;
    let response = await firstValueFrom(this.lobbyMessageService.GetLobbyMessagesByStoryId(this.story.storyId));
    this.lobbyMessages = response;
  }

  async SendLobbyMessage() {
    if (this.messageInputValue === "") return;
    if (!this.currentUser) return;
    let lobbyMessage = new LobbyMessage();
    lobbyMessage.storyId = this.story?.storyId;
    lobbyMessage.message = this.messageInputValue;
    lobbyMessage.userId = this.currentUser.userId;
    let response = await firstValueFrom(this.lobbyMessageService.CreateLobbyMessage(lobbyMessage));
    if (response) await this.GetLobbyMessages();
  }
}
