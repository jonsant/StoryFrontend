import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { User } from "../models/User";

@Injectable({ providedIn: 'root' })
export class UserService {
    baseUrl: string = environment.baseUrl;
    constructor(private httpClient: HttpClient) {
    }

    GetUserById(userId: string): Observable<User> {
        return this.httpClient.get<User>(this.baseUrl + "GetUserById/" + userId);
    }

    GetUserByName(username: string): Observable<User[]> {
        return this.httpClient.get<User[]>(this.baseUrl + "GetUserByName/" + username);
    }
}