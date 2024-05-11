import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Forecast } from "../models/Forecast";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

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
}