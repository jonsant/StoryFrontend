import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './AuthenticationService';
import { GetUser } from '../models/User';
import { LobbyMessage } from '../models/LobbyMessage';
import { Story } from '../models/Story';
import { StoryService } from './StoryService';

@Injectable({
    providedIn: 'root',
})
export class StoryLobbySignalRService {
    private hubConnection?: signalR.HubConnection;
    authService = inject(AuthenticationService);
    storyService = inject(StoryService);

    constructor() {
    }

    startConnection(currentStoryId: string): Observable<void> {
        let currentStory = this.storyService.GetSavedCurrentStoryId() ?? "";
        let t = this.authService.getCurrentUser()?.token ?? "";
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.baseUrl + 'storyhub/' + currentStoryId, { accessTokenFactory: () => t })
            .withAutomaticReconnect() // enable AutoReconnect
            .build();
        return new Observable<void>((observer) => {
            this.hubConnection!
                .start()
                .then(() => {
                    console.log('Connection established with StoryLobby hub');
                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    console.error('Error connecting to StoryLobby hub:', error);
                    observer.error(error);
                });
        });

    }

    reconnecting(): Observable<Error | undefined> {
        return new Observable<Error | undefined>((observer) => {
            this.hubConnection!.onreconnecting(error => {
                observer.next(error);
            });
        });
    }

    reconnected(): Observable<string | undefined> {
        return new Observable<string | undefined>((observer) => {
            this.hubConnection!.onreconnected(connectionId => {
                observer.next(connectionId)
            });
        });
    }

    receiveMessage(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection!.on('ReceiveMessage', (message: string) => {
                observer.next(message);
            });
        });
    }

    sendMessage(message: string): void {
        this.hubConnection!.invoke('SendMessage', message);
    }

    joinedLobby(): Observable<LobbyMessage> {
        return new Observable<LobbyMessage>((observer) => {
            this.hubConnection!.on('NewLobbyMessage', (message: LobbyMessage) => {
                observer.next(message);
            });
        });
    }

    storyChanged(): Observable<Story> {
        return new Observable<Story>((observer) => {
            this.hubConnection!.on('StoryChanged', (story: Story) => {
                observer.next(story);
            });
        });
    }

    newEntry(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection!.on('NewEntry', (currentPlayerId: string) => {
                observer.next(currentPlayerId);
            });
        });
    }

    inviteAccepted(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection!.on('InviteAccepted', (username: string) => {
                observer.next(username);
            });
        });
    }

    stopConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop();
            // this.hubConnection = undefined;
        }
    }
}