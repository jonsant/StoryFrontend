import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { StartStory, Story } from "../models/Story";
import { CreateEntry } from "../models/StoryEntry";
import { SessionStorageService } from "./SessionStorageService";

@Injectable({ providedIn: 'root' })
export class StoryService {
    baseUrl: string = environment.baseUrl;
    private currentStoryId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    private sessionStorageService = inject(SessionStorageService);
    constructor(private httpClient: HttpClient) {
        const curStor = this.sessionStorageService.GetCurrentStoryId();
        this.currentStoryId$.next(curStor);
    }

    GetForecasts(): Observable<Forecast[]> {
        return this.httpClient.get<Forecast[]>(this.baseUrl + "GetForecastBackendTest");
    }

    CreateForecast(forecast: Forecast): Observable<Forecast> {
        return this.httpClient.post(this.baseUrl + "CreateForecastBackendTest", forecast);
    }

    GetStoryById(storyId: string): Observable<Story> {
        return this.httpClient.get<Story>(this.baseUrl + "GetStoryById/" + storyId);
    }

    GetStoriesByUserId(): Observable<Story[]> {
        return this.httpClient.get<Story[]>(this.baseUrl + "GetStoriesByUserId");
    }

    GetParticipantStoriesByUserId(): Observable<Story[]> {
        return this.httpClient.get<Story[]>(this.baseUrl + "GetParticipantStoriesByUserId");
    }

    CreateStory(story: Story): Observable<Story> {
        return this.httpClient.post(this.baseUrl + "CreateStory", story);
    }

    StartStory(startStory: StartStory): Observable<StartStory> {
        return this.httpClient.put<StartStory>(this.baseUrl + 'StartStory', startStory);
    }

    CreateEntry(createEntry: CreateEntry): Observable<CreateEntry> {
        return this.httpClient.post<CreateEntry>(this.baseUrl + 'CreateEntry', createEntry);
    }

    EndStory(finalEntry: CreateEntry): Observable<CreateEntry> {
        return this.httpClient.post<CreateEntry>(this.baseUrl + 'EndStory', finalEntry);
    }

    SetCurrentStoryId(storyId: string | null) {
        if (storyId === null) {
            sessionStorage.removeItem("currentStoryId");
        }
        if (storyId !== null) {
            sessionStorage.setItem("currentStoryId", storyId);
        }
        this.currentStoryId$.next(storyId);
    }

    GetCurrentStoryIdUpdated$(): Observable<string | null> {
        return this.currentStoryId$.asObservable();
    }
}