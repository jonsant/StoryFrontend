import { Component, inject } from '@angular/core';
import { StoryService } from '../services/StoryService';
import { Forecast } from '../models/Forecast';
import { lastValueFrom } from 'rxjs';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Story } from '../models/Story';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [
    JsonPipe,
    MatTableModule,
    DatePipe,
    CommonModule,
    MatIconModule
  ]
})
export class HomeComponent {
  storyService = inject(StoryService);
  router = inject(Router);
  forecasts?: Forecast[];
  stories?: Story[];
  displayedColumns: string[] = ['storyName'];
  filteredStories: Story[] = [];
  // name = JSON.parse(sessionStorage.getItem("user")!).name;

  async ngOnInit() {
    // this.forecasts = await lastValueFrom(this.storyService.GetForecasts());
    await this.GetStories();
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

  async GetStories() {
    this.stories = await lastValueFrom(this.storyService.GetStoriesByUserId());
    this.filteredStories = this.stories;
  }

  async StoryClicked(row: any) {
    let story = row as Story;
    if (!story.storyId) return;
    sessionStorage.setItem("currentStoryId", story.storyId);
    this.router.navigate(['story']);
  }
}
