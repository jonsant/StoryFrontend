import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { Register, RegisterResponse } from "../models/Register";
import { CurrentUser } from "../models/User";
import { Login, LoginResponse } from "../models/Login";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private registerUrl = "Register";
    private loginUrl = "Login";
    private forecastTestUrl = "GetForecastBackendTest";
    private httpClient = inject(HttpClient);
    private currentUser: CurrentUser | null = null;
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

    public getCurrentUserUpdated$() {
        return this.currentUserUpdated$.asObservable();
    }

    public logout() {
        localStorage.removeItem('CurrentUser');
        this.currentUser = null;
        this.currentUserUpdated$.next(true);
    }
}