import { Component, inject } from '@angular/core';
import { StoryService } from '../services/StoryService';
import { Forecast } from '../models/Forecast';
import { lastValueFrom } from 'rxjs';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Story } from '../models/Story';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../services/AuthenticationService';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatIconModule,
    MatTabsModule,
    FormsModule,
    MatProgressSpinnerModule
  ]
})
export class HomeComponent {
  storyService = inject(StoryService);
  authenticationService = inject(AuthenticationService);
  router = inject(Router);
  stories: Story[] = [];
  participantStories: Story[] = [];
  displayedColumns: string[] = ['storyName'];
  filteredStories: Story[] = [];
  showMyStories: boolean = true;
  loadingStories: boolean = true;
  // name = JSON.parse(sessionStorage.getItem("user")!).name;

  async ngOnInit() {
    await this.GetStories();
  }

  async GetStories() {
    this.stories = await lastValueFrom(this.storyService.GetStoriesByUserId());
    this.filteredStories = this.stories;
    this.participantStories = await lastValueFrom(this.storyService.GetParticipantStoriesByUserId());
    this.loadingStories = false;
  }

  async StoryClicked(row: any) {
    let story = row as Story;
    if (!story.storyId) return;
    sessionStorage.setItem("currentStoryId", story.storyId);
    this.router.navigate(['story', story.storyId]);
  }
}
