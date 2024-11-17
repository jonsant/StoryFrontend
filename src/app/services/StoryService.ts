import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Story } from "../models/Story";

@Injectable({ providedIn: 'root' })
export class StoryService {
    baseUrl: string = environment.baseUrl;
    constructor(private httpClient: HttpClient) {
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
}