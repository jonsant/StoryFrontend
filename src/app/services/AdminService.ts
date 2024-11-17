import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AcceptInvite, Invitee } from "../models/Invitee";
import { AddEmail } from "../models/Admin";

@Injectable({ providedIn: 'root' })
export class AdminService {
    baseUrl: string = environment.baseUrl;
    constructor(private httpClient: HttpClient) {
    }

    AddEmail(addEmail: AddEmail): Observable<string | null> {
        return this.httpClient.post<string | null>(this.baseUrl + "AddEmail", addEmail);
    }
}