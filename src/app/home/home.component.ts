import { Component, inject } from '@angular/core';
import { StoryService } from '../services/StoryService';
import { Forecast } from '../models/Forecast';
import { lastValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    JsonPipe
  ]
})
export class HomeComponent {
  storyService = inject(StoryService);
  forecasts?: Forecast[];
  // name = JSON.parse(sessionStorage.getItem("user")!).name;

  async ngOnInit() {
    this.forecasts = await lastValueFrom(this.storyService.GetForecasts());
  }

  async CreateForecast() {
    const forecast = new Forecast();
    forecast.Date = new Date();
    forecast.Summary = "test från frontend";
    forecast.TemperatureC = 1000;
    forecast.WeatherForecastId = "potatis";
    let response = await lastValueFrom(this.storyService.CreateForecast(forecast));
    this.forecasts?.push(response);
  }
}
