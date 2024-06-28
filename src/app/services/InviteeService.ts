import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AcceptInvite, Invitee } from "../models/Invitee";

@Injectable({ providedIn: 'root' })
export class InviteeService {
    baseUrl: string = environment.baseUrl;
    constructor(private httpClient: HttpClient) {
    }

    GetStoryInvites(): Observable<Invitee[]> {
        return this.httpClient.get<Invitee[]>(this.baseUrl + "GetStoryInvites");
    }

    AcceptInvite(inviteeId: AcceptInvite): Observable<Invitee> {
        return this.httpClient.post<Invitee>(this.baseUrl + "AcceptInvite", inviteeId);
    }
}