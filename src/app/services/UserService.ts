import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { GetUser } from "../models/User";
// import { User } from "../models/User";

@Injectable({ providedIn: 'root' })
export class UserService {
    baseUrl: string = environment.baseUrl;
    httpClient = inject(HttpClient);

    // GetUserById(userId: string): Observable<User> {
    //     return this.httpClient.get<User>(this.baseUrl + "GetUserById/" + userId);
    // }

    GetUserByName(username: string): Observable<GetUser[]> {
        return this.httpClient.get<GetUser[]>(this.baseUrl + "GetUserByName/" + username);
    }

    // SetCurrentUser(user: User) {
    //     this.currentUser$.next(user);
    // }

    // GetCurrentUser() {
    //     return this.currentUser$.asObservable();
    // }
}