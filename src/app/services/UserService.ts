import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { GetUser } from "../models/User";
import { NewUsername } from "../models/NewUsername";
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

    UsernameAvailable(username: string): Observable<boolean> {
        return this.httpClient.get<boolean>(this.baseUrl + 'UsernameAvailable/' + username);
    }

    ChangeUsername(newUsername: string): Observable<GetUser | null> {
        let newName = NewUsername.Create(newUsername);
        return this.httpClient.put<GetUser | null>(this.baseUrl + 'ChangeUsername', newName);
    }

    // SetCurrentUser(user: User) {
    //     this.currentUser$.next(user);
    // }

    // GetCurrentUser() {
    //     return this.currentUser$.asObservable();
    // }
}