import { Component, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, MinLengthValidator, MinValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxDebounceInputDirective } from 'ngx-debounce-input';
import { UserService } from '../services/UserService';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { CurrentUser, GetUser } from '../models/User';
import { lastValueFrom } from 'rxjs';
import { SelectionChange } from '@angular/cdk/collections';
import { MatChipsModule } from '@angular/material/chips';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    NgxDebounceInputDirective,
    MatAutocompleteModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @ViewChild(MatAutocompleteTrigger) autocomplete?: MatAutocompleteTrigger;
  userService = inject(UserService);
  storyService = inject(StoryService);
  router = inject(Router);
  foundInvitees: GetUser[] = [];
  invitees: GetUser[] = [];
  story?: Story;
  searchingUsers: boolean = false;
  createFormGroup: FormGroup = new FormGroup({
    storyName: new FormControl<string>("", [Validators.minLength(2)]),
    inviteeInput: new FormControl<string>("")
  }
  );

  ngOnInit() {
  }

  async AddInvitee(selection: any) {
    if (this.foundInvitees.length === 0) {
      await this.InviteeInput();
    }

    let alreadyInvitee = this.invitees.find(u => u.username === selection);
    if (alreadyInvitee) {
      this.createFormGroup.controls['inviteeInput'].patchValue("");
      return;
    }

    let userToInvite = this.foundInvitees.find(u => u.username === selection);
    this.createFormGroup.controls['inviteeInput'].patchValue("");
    if (!userToInvite) return;
    this.invitees.push(userToInvite);

  }

  async InviteeInput() {
    if (this.createFormGroup.controls['inviteeInput'].value === "") return;
    this.foundInvitees = await lastValueFrom(this.userService.GetUserByName(this.createFormGroup.controls['inviteeInput'].value));
    this.searchingUsers = false;
  }

  InviteInput() {
    if (this.createFormGroup.controls['inviteeInput'].value === "") return;
    this.searchingUsers = true;
  }

  CloseInviteePanel() {
    if (this.autocomplete) {
      this.autocomplete.closePanel();
    }
  }

  async CreateStory() {
    if (!this.createFormGroup.controls['storyName'].valid) return;
    this.story = new Story();
    this.story.storyName = this.createFormGroup.controls['storyName'].value;
    if (this.invitees.length === 0) return;
    let inv: string[] = this.invitees.map(u => {
      if (!u || !u.username) return "";
      return u.username;
    });
    this.story.invitees = inv;
    let response = await lastValueFrom(this.storyService.CreateStory(this.story));
    if (response.storyId && response.storyId !== '') {
      await this.storyService.SetCurrentStoryId(response.storyId);
      this.router.navigate(['/story']);
    }
  }

}
