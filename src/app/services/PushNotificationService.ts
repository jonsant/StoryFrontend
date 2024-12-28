import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom, Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AcceptInvite, Invitee } from "../models/Invitee";
import { AddUserPushNotificationToken } from "../models/PushNotification";
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

    GetAllowPushNotifications(): boolean {
        // const allow = localStorage.getItem("allowPushNotifications");
        // return allow === null ? false : allow as unknown as boolean;
        return Notification.permission === 'granted';
    }

    GetAllowPushNotificationsUpdated$() {
        return this.allowPushNotificationsUpdated$.asObservable();
    }

    SetAllowPushNotificationsUpdated(value: boolean) {
        this.allowPushNotificationsUpdated$.next(value);
    }

    async UnsubscribeFromPushNotifications() {
        navigator.serviceWorker.getRegistration("./ngsw-worker.js")
            .then(async (registration) => {
                console.log(this.messaging);
                if (!registration) return;
                return;
                deleteToken(this.messaging!).then(async () => {
                    console.log("token was deleted");
                    // return;
                    const registration = await navigator.serviceWorker.getRegistration("./ngsw-worker.js");
                    if (!registration) return;
                    console.log("registration: ", registration);

                    const subscription = await registration.pushManager.getSubscription();
                    console.log("subscription: ", subscription);
                    if (!subscription) return;

                    const unsubscribed = await subscription.unsubscribe().then(unsubed => {
                        if (unsubed) {
                            console.log("unsubed!!");
                            // this.SetAllowPushNotificationsUpdated(false);

                            registration.unregister().then(function (registered) {
                                console.log("unregistered: ", registered);
                            });
                        }
                        else {
                            console.log("not unsubed!!");
                        }
                    });
                });
                // Remove token from backend server
                // console.log("could not delete token");
                // const response = await firstValueFrom(this.AddUserPushNotificationToken(AddUserPushNotificationToken.Create(currentToken)));
                // console.log("delete token response: ", response);
            });

    }

    SetupFirebase() {
        // Get service worker registration
        navigator.serviceWorker.getRegistration("./ngsw-worker.js")
            .then(async (registration) => {
                console.log("got registration: ", registration);
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    console.log("Permission not granted!");
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
                            console.log("currentToken for push notifications: ", currentToken);
                            const response = await firstValueFrom(this.AddUserPushNotificationToken(AddUserPushNotificationToken.Create(currentToken)));
                            console.log("response: ", response);
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
                        console.log('No registration token available. Request permission to generate one.');
                        this.SetAllowPushNotificationsUpdated(false);

                    }).catch((err) => {
                        console.log('An error occurred retrieving the token. ', err);
                        this.SetAllowPushNotificationsUpdated(false);
                    });
            });
    }
}