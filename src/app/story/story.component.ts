import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { StoryService } from '../services/StoryService';
import { StartStory, Story } from '../models/Story';
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
import { ActivatedRoute, Router } from '@angular/router';
import { StoryLobbySignalRService } from '../services/StorySignalRService';
import { SessionStorageService } from '../services/SessionStorageService';
import { CommonModule } from '@angular/common';
import { CreateEntry } from '../models/StoryEntry';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent {
  storyService = inject(StoryService);
  storyLobbySignalRService = inject(StoryLobbySignalRService);
  router = inject(Router);
  story?: Story;
  status: string = "";
  messageInputValue: string = "";
  entryFirstInputValue: string = "";
  entrySecondInputValue: string = "";
  lobbyMessages: LobbyMessage[] = [];
  lobbyMessageService = inject(LobbyMessageService);
  userService = inject(UserService);
  authenticationService = inject(AuthenticationService);
  sessionStorageService = inject(SessionStorageService);
  currentUser: CurrentUser | null = null;
  currentUserUpdated$?: Subscription;
  storyHubSignalRConnection$?: Subscription;
  joinedLobby$?: Subscription;
  storyChanges$?: Subscription;
  newEntry$?: Subscription;
  currentStoryId: string | null = null;
  finalEntryClicked?: string = "";
  route: ActivatedRoute = inject(ActivatedRoute);
  entrySubmitted: boolean = false;
  @ViewChild('chat') private chatContainer?: ElementRef;

  async ngOnInit() {
    this.currentStoryId = this.route.snapshot.paramMap.get('storyId');
    console.log("currrrrrent ", this.currentStoryId);
    if (this.currentStoryId === null) this.currentStoryId = this.sessionStorageService.GetCurrentStoryId();
    if (this.currentStoryId === null) this.router.navigate(['home']);

    this.currentUserUpdated$ = this.authenticationService.getCurrentUserUpdated$().subscribe(v => {
      this.currentUser = this.authenticationService.getCurrentUser();

      this.storyHubSignalRConnection$ = this.storyLobbySignalRService.startConnection(this.currentStoryId!).subscribe(() => {
        this.SubscribeLobbyMessages();
        this.SubscribeStoryChanges();
        this.SubscribeNewEntry();
      });
    });
    await this.GetStory();
    await this.GetLobbyMessages();
    this.MapStatusText();
  }

  SubscribeLobbyMessages() {
    this.joinedLobby$ = this.storyLobbySignalRService.joinedLobby().subscribe(message => {
      this.lobbyMessages.push(message);
    });
  }

  SubscribeStoryChanges() {
    this.storyChanges$ = this.storyLobbySignalRService.storyChanged().subscribe(story => {
      // this.story!.status = status;
      this.story = story;
      this.MapStatusText();
    });

    // this.storyLobbySignalRService.reconnecting().subscribe(error => {
    //   console.log("efrrrrrrrrrrrrrrrrrrrrrrrrrrrrr ", error);
    // });

    // this.storyLobbySignalRService.reconnected().subscribe(i => {
    //   console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!! ", i);
    // });
  }

  SubscribeNewEntry() {
    this.newEntry$ = this.storyLobbySignalRService.newEntry().subscribe(async currentPlayerId => {
      // this.story!.currentPlayerId = currentPlayerId;
      // if (this.currentUser?.userId === currentPlayerId) {
      await this.GetStory();
      this.entryFirstInputValue = "";
      this.entrySecondInputValue = "";
      this.entrySubmitted = false;
      // }
    });
  }

  MapStatusText() {
    switch (this.story?.status) {
      case "Created": this.status = "Waiting to start";
        break;
      case "Active": this.status = "Active";
        break;
      case "Finished": this.status = "Finished";
        break;
      default: "";
    }
  }

  BackButtonClicked() {
    this.router.navigate(['/home']);
  }

  async GetStory() {
    if (this.currentStoryId === null) return;
    let response = await lastValueFrom(this.storyService.GetStoryById(this.currentStoryId));
    this.story = response;
    console.log(this.story.numberOfEntries);
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
    // if (response) await this.GetLobbyMessages();
    this.messageInputValue = "";
  }

  async StartStory() {
    if (this.story?.status !== 'Created') return;
    if (!this.story.storyId) return;
    let response = await firstValueFrom(this.storyService.StartStory(StartStory.Create(this.story.storyId)));
  }

  async SubmitEntry() {
    if (this.entryFirstInputValue === '' || this.entrySecondInputValue === '') return;
    if (!this.story?.storyId) return;
    this.entrySubmitted = true;
    let response = await firstValueFrom(this.storyService.CreateEntry(CreateEntry.Create(
      this.story?.storyId,
      this.entryFirstInputValue,
      this.entrySecondInputValue,
      false
    )));
  }

  async EndStory() {
    if (this.entryFirstInputValue === '') return;
    if (!this.story?.storyId) return;
    this.entrySubmitted = true;
    let response = await firstValueFrom(this.storyService.EndStory(CreateEntry.Create(
      this.story?.storyId,
      this.entryFirstInputValue,
      this.entrySecondInputValue,
      true
    )));
  }

  ngOnDestroy() {
    this.currentUserUpdated$ && this.currentUserUpdated$.unsubscribe();
    this.storyHubSignalRConnection$ && this.storyHubSignalRConnection$.unsubscribe();
    this.joinedLobby$ && this.joinedLobby$.unsubscribe();
    this.storyChanges$ && this.storyChanges$.unsubscribe();
    this.storyLobbySignalRService.stopConnection();
  }
}
