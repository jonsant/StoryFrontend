import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
import { UserService } from '../services/UserService';
import { CurrentUser } from '../models/User';
import { AuthenticationService } from '../services/AuthenticationService';
import { Router } from '@angular/router';

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
  router = inject(Router);
  story?: Story;
  status: string = "";
  messageInputValue: string = "";
  lobbyMessages: LobbyMessage[] = [];
  lobbyMessageService = inject(LobbyMessageService);
  userService = inject(UserService);
  authenticationService = inject(AuthenticationService);
  currentUser: CurrentUser | null = null;
  currentUserUpdated$?: Subscription;
  @ViewChild('chat') private chatContainer?: ElementRef;

  async ngOnInit() {
    this.currentUserUpdated$ = this.authenticationService.getCurrentUserUpdated$().subscribe(v => {
      this.currentUser = this.authenticationService.getCurrentUser();
    });
    let lb = new LobbyMessage();
    lb.message = "starta nu då!!!!! annars klår jag upp er allihopa! okej? capish?";
    lb.username = "story-user-slkjfslfaj";
    await this.GetStory();
    await this.GetLobbyMessages();

    switch (this.story?.status) {
      case "Created": this.status = "Waiting to start";
        break;
      case "Active": this.status = "Active";
        break;
      case "Finished": this.status = "Completed";
        break;
      default: "";
    }
  }

  BackButtonClicked() {
    this.router.navigate(['/home']);
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

  ngAfterViewChecked() {
    this.scrollToElement();
  }

  scrollToElement(): void {
    if (!this.chatContainer) return;
    this.chatContainer.nativeElement.scroll({
      top: this.chatContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
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
    this.messageInputValue = "";
  }
}
