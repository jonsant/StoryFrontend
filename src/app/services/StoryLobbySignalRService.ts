import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './AuthenticationService';
import { SessionStorageService } from './SessionStorageService';
import { GetUser } from '../models/User';
import { LobbyMessage } from '../models/LobbyMessage';

@Injectable({
    providedIn: 'root',
})
export class StoryLobbySignalRService {
    private hubConnection: signalR.HubConnection;
    authService = inject(AuthenticationService);
    sessionStorageService = inject(SessionStorageService);

    constructor() {
        let currentStory = this.sessionStorageService.GetCurrentStoryId() ?? "";
        let t = this.authService.getCurrentUser()?.token ?? "";
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.baseUrl + 'lobbyhub/' + currentStory, { accessTokenFactory: () => t })
            .build();
    }

    startConnection(): Observable<void> {
        return new Observable<void>((observer) => {
            this.hubConnection
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

    receiveMessage(): Observable<string> {
        return new Observable<string>((observer) => {
            this.hubConnection.on('ReceiveMessage', (message: string) => {
                observer.next(message);
            });
        });
    }

    sendMessage(message: string): void {
        this.hubConnection.invoke('SendMessage', message);
    }

    joinedLobby(): Observable<LobbyMessage> {
        return new Observable<LobbyMessage>((observer) => {
            this.hubConnection.on('NewLobbyMessage', (message: LobbyMessage) => {
                observer.next(message);
            });
        });
    }
}