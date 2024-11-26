import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AcceptInvite, Invitee } from "../models/Invitee";

@Injectable({ providedIn: 'root' })
export class InviteeService {
    private newInvite: Subject<Invitee> = new Subject<Invitee>();
    // newInviterecieved$ = this.newInvite.asObservable();
    baseUrl: string = environment.baseUrl;
    constructor(private httpClient: HttpClient) {
    }

    GetStoryInvites(): Observable<Invitee[]> {
        return this.httpClient.get<Invitee[]>(this.baseUrl + "GetStoryInvites");
    }

    AcceptInvite(inviteeId: AcceptInvite): Observable<Invitee> {
        return this.httpClient.post<Invitee>(this.baseUrl + "AcceptInvite", inviteeId);
    }

    GetNewInviteRecieved() {
        return this.newInvite.asObservable();
    }

    SetNewInviteRecieved(newInvite: Invitee) {
        this.newInvite.next(newInvite);
    }
}