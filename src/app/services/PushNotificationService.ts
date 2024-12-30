import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom, Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AcceptInvite, Invitee } from "../models/Invitee";
import { AddUserPushNotificationToken, DeleteUserPushNotificationToken, GetUserPushNotificationToken, ToggleUserPushNotificationToken } from "../models/PushNotification";
import { deleteToken, getToken, Messaging } from "@angular/fire/messaging";

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
    baseUrl: string = environment.baseUrl;
    private readonly messaging = inject(Messaging, { optional: true });
    private allowPushNotificationsUpdated$: Subject<boolean> = new Subject<boolean>();

    constructor(private httpClient: HttpClient) {
    }

    AddUserPushNotificationToken(addUserPushNotificationToken: AddUserPushNotificationToken): Observable<AddUserPushNotificationToken> {
        return this.httpClient.post<AddUserPushNotificationToken>(this.baseUrl + "AddUserPushNotificationToken", addUserPushNotificationToken);
    }

    DeletePushNotificationToken(token: string): Observable<DeleteUserPushNotificationToken> {
        return this.httpClient.delete<DeleteUserPushNotificationToken>(this.baseUrl + "DeleteUserPushNotificationToken/" + token);
    }

    async GetAllowPushNotificationsEnabled(): Promise<boolean> {
        const registration = await navigator.serviceWorker.getRegistration("./ngsw-worker.js");
        if (!registration) return false;

        const currentToken = await getToken(this.messaging!,
            {
                vapidKey: environment.vapidKey,
                serviceWorkerRegistration: registration
            });
        if (currentToken) {
            let response = await firstValueFrom(this.GetAllowPushNotifications(currentToken));
            if (!response || response == null) return false;
            return response.enabled;
        }
        else {
            return false;
        }
    }

    GetAllowPushNotifications(token: string): Observable<GetUserPushNotificationToken> {
        return this.httpClient.get<GetUserPushNotificationToken>(this.baseUrl + "GetUserPushNotificationToken/" + token);
    }

    GetAllowPushNotificationsUpdated$() {
        return this.allowPushNotificationsUpdated$.asObservable();
    }

    SetAllowPushNotificationsUpdated(value: boolean) {
        this.allowPushNotificationsUpdated$.next(value);
    }

    async UnsubscribeFromPushNotifications() {
        const registration = await navigator.serviceWorker.getRegistration("./ngsw-worker.js");
        if (!registration) return;

        const currentToken = await getToken(this.messaging!,
            {
                vapidKey: environment.vapidKey,
                serviceWorkerRegistration: registration
            });
        if (currentToken) {
            let response = await firstValueFrom(this.DeletePushNotificationToken(currentToken));
        }
        else {
            console.log("No current token to delete");
        }
    }

    async TogglePushNotifications(enabled: boolean) {
        if (Notification.permission !== 'granted') {
            this.SetupFirebase();
            return;
        }
        const registration = await navigator.serviceWorker.getRegistration("./ngsw-worker.js");
        if (!registration) return;

        const currentToken = await getToken(this.messaging!,
            {
                vapidKey: environment.vapidKey,
                serviceWorkerRegistration: registration
            });
        if (currentToken) {
            let response = await firstValueFrom(this.TogglePushNotification(currentToken, enabled));
            if (response && response !== null) {
                this.SetAllowPushNotificationsUpdated(response.enabled);
            }
            else {
                await this.SetupFirebase();
            }
        }
        else {
            console.log("No current token to toggle");
        }
    }

    TogglePushNotification(token: string, enabled: boolean): Observable<ToggleUserPushNotificationToken> {
        return this.httpClient.put<ToggleUserPushNotificationToken>(this.baseUrl + "ToggleUserPushNotificationToken", ToggleUserPushNotificationToken.Create(token, enabled));
    }

    SetupFirebase() {
        // Get service worker registration
        navigator.serviceWorker.getRegistration("./ngsw-worker.js")
            .then(async (registration) => {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    this.SetAllowPushNotificationsUpdated(false);
                    return;
                }
                getToken(this.messaging!,
                    {
                        vapidKey: environment.vapidKey,
                        serviceWorkerRegistration: registration
                    }).then(async (currentToken) => {
                        if (currentToken) {
                            // Send token to server and associate with user, and update UI if necessary
                            const response = await firstValueFrom(this.AddUserPushNotificationToken(AddUserPushNotificationToken.Create(currentToken)));
                            let subscription = await registration!.pushManager.getSubscription();
                            if (!subscription) {
                                subscription = await registration!.pushManager.subscribe({
                                    userVisibleOnly: true,
                                    applicationServerKey: environment.vapidKey
                                });
                            }
                            this.SetAllowPushNotificationsUpdated(true);
                            return;
                        }
                        // Show UI permission request dialog
                        console.log("No registration token available. Do permission request to generate one.");
                        this.SetAllowPushNotificationsUpdated(false);

                    }).catch((err) => {
                        console.log('An error occurred retrieving the token. ', err);
                        this.SetAllowPushNotificationsUpdated(false);
                    });
            });
    }
}