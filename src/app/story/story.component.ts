import { Component, inject } from '@angular/core';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { lastValueFrom } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-story',
  standalone: true,
  imports: [
    MatChipsModule,
  ],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent {
  storyService = inject(StoryService);
  story?: Story;
  status: string = "";
  // participants: string[] = [];

  async ngOnInit() {
    await this.GetStory();

    switch (this.story?.status) {
      case "Created": this.status = "Väntar på start";
        break;
      case "Active": this.status = "Pågår";
        break;
      case "Finished": this.status = "Avslutad";
        break;
      default: "";
    }
  }

  async GetStory() {
    const id = sessionStorage.getItem("currentStoryId");
    if (!id) return;
    let response = await lastValueFrom(this.storyService.GetStoryById(id));
    this.story = response;
  }
}
