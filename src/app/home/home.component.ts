import { Component, inject } from '@angular/core';
import { StoryService } from '../services/StoryService';
import { Forecast } from '../models/Forecast';
import { lastValueFrom, Subscription } from 'rxjs';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Story } from '../models/Story';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../services/AuthenticationService';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

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
    MatProgressSpinnerModule,
    MatListModule
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
  // showMyStories: boolean = true;
  loadingStories: boolean = true;
  storyWasCreated$?: Subscription;
  selectedTabIndex: number = 0;

  async ngOnInit() {
    // this.SetUrl();
    if (window.location.href.includes("part=true")) {
      this.selectedTabIndex = 1;
    }
    await this.GetStories();
    this.storyWasCreated$ = this.storyService.GetStoryWasCreated$().subscribe(story => {
      this.stories = [story, ...this.stories];
    });
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
    await this.storyService.SetCurrentStoryId(story.storyId);
    this.router.navigate(['story']);
  }

  TabChanged() {
    // this.showMyStories = !this.showMyStories;
    this.SetUrl();
  }

  SetUrl() {
    console.log(this.selectedTabIndex);
    if (this.selectedTabIndex === 1) {
      window.location.href += "?part=true";
    }
    else {
      window.location.href = window.location.href.replace("?part=true", "");
    }
  }

  ngOnDestroy() {
    this.storyWasCreated$ && this.storyWasCreated$.unsubscribe();
  }
}
