import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './AuthenticationService';
import { SessionStorageService } from './SessionStorageService';
import { GetUser } from '../models/User';
import { LobbyMessage } from '../models/LobbyMessage';
import { Invitee } from '../models/Invitee';

@Injectable({
    providedIn: 'root',
})
export class UserSignalRService {
    private hubConnection?: signalR.HubConnection;
    authService = inject(AuthenticationService);
    sessionStorageService = inject(SessionStorageService);

    constructor() {
    }

    startConnection(): Observable<void> {
        let t = this.authService.getCurrentUser()?.token ?? "";
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(environment.baseUrl + 'userhub', { accessTokenFactory: () => t })
            .withAutomaticReconnect()
            .build();
        return new Observable<void>((observer) => {
            this.hubConnection!
                .start()
                .then(() => {
                    console.log('Connection established with Userhub');
                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    console.error('Error connecting to Userhub:', error);
                    observer.error(error);
                });
        });
    }

    NewInvite(): Observable<Invitee> {
        return new Observable<Invitee>((observer) => {
            this.hubConnection!.on('NewInvite', (invite: Invitee) => {
                observer.next(invite);
            });
        });
    }

    // sendMessage(message: string): void {
    //     this.hubConnection!.invoke('SendMessage', message);
    // }

    stopConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop();
            // this.hubConnection = undefined;
        }
    }
}