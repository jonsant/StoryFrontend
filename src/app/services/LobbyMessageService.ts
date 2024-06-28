import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { LobbyMessage } from "../models/LobbyMessage";

@Injectable({ providedIn: 'root' })
export class LobbyMessageService {
    baseUrl: string = environment.baseUrl;
    constructor(private httpClient: HttpClient) {
    }

    GetLobbyMessagesByStoryId(storyId: string): Observable<LobbyMessage[]> {
        return this.httpClient.get<LobbyMessage[]>(this.baseUrl + "GetLobbyMessagesByStoryId/" + storyId);
    }

    CreateLobbyMessage(lobbyMessage: LobbyMessage): Observable<LobbyMessage> {
        return this.httpClient.post<LobbyMessage>(this.baseUrl + "CreateLobbyMessage", lobbyMessage);
    }
}