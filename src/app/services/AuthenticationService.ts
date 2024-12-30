import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable, OnDestroy } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { BehaviorSubject, firstValueFrom, Observable, ReplaySubject, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { Register, RegisterResponse } from "../models/Register";
import { CurrentUser } from "../models/User";
import { Login, LoginResponse } from "../models/Login";
import { ResetPassword, ResetPasswordEmailRequest } from "../models/ResetPassword";
import { PushNotificationService } from "./PushNotificationService";

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnDestroy {
    private registerUrl = "Register";
    private loginUrl = "Login";
    private forecastTestUrl = "GetForecastBackendTest";
    private httpClient = inject(HttpClient);
    private currentUser: CurrentUser | null = null;
    private pushNotificationService = inject(PushNotificationService);
    private currentUserUpdated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public register(user: Register): Observable<RegisterResponse> {
        return this.httpClient.post<RegisterResponse>(`${environment.baseUrl}${this.registerUrl}`, user);
    }

    public login(user: Login): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(`${environment.baseUrl}${this.loginUrl}`, user);
    }

    public getWeather(): Observable<any> {
        return this.httpClient.get<any>(`${environment.baseUrl}${this.forecastTestUrl}`);
    }

    public saveCurrentUser(user: CurrentUser) {
        localStorage.setItem('CurrentUser', JSON.stringify(user));
        this.currentUser = user;
        this.currentUserUpdated$.next(true);
    }

    public getCurrentUser(): CurrentUser | null {
        if (this.currentUser !== null) return this.currentUser;
        const currentUserItem = localStorage.getItem('CurrentUser');
        return currentUserItem === null ? null : JSON.parse(currentUserItem);
    }

    public getCurrentUserRefresh(): Observable<LoginResponse> {
        return this.httpClient.get<LoginResponse>(environment.baseUrl + 'GetCurrentUser');
    }

    public async refreshCurrentUser() {
        let result = await firstValueFrom(this.getCurrentUserRefresh());
        if (!result.result || result.token === '') return;
        let user = CurrentUser.Create(
            result.token,
            result.userId,
            result.username,
            result.email,
            result.roles
        );
        this.saveCurrentUser(user);
        this.currentUserUpdated$.next(true);
    }

    public getCurrentUserUpdated$() {
        return this.currentUserUpdated$.asObservable();
    }

    public async logout() {
        await this.pushNotificationService.UnsubscribeFromPushNotifications();
        localStorage.removeItem('CurrentUser');
        localStorage.removeItem('CurrentStoryId');
        this.currentUser = null;
        this.currentUserUpdated$.next(true);
    }

    public resetPassword(email: string, newPassword: string, token: string): Observable<ResetPassword | null> {
        return this.httpClient.post<ResetPassword | null>(environment.baseUrl + 'ResetPassword',
            ResetPassword.Create(email, newPassword, token),
        );
    }

    public resetPasswordEmailRequest(email: ResetPasswordEmailRequest): Observable<ResetPasswordEmailRequest | null> {
        return this.httpClient.post<ResetPasswordEmailRequest | null>(environment.baseUrl + 'ResetPasswordEmail', email);
    }

    ngOnDestroy(): void {

    }
}