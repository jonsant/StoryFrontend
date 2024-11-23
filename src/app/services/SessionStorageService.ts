import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SessionStorageService {

    public GetCurrentStoryId(): string | null {
        return sessionStorage.getItem('currentStoryId');
    }
}