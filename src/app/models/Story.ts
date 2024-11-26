import { FinalStoryEntry } from "./StoryEntry";

export class Story {
    storyId?: string;
    storyName?: string;
    creatorUserId?: string;
    creatorUsername?: string;
    created?: Date;
    finished?: Date;
    status?: string;
    currentPlayerInOrder?: string;
    currentPlayerId?: string;
    finalStory?: string;
    invitees?: string[];
    participants?: string[];
    numberOfEntries?: number;
    sentenceToFinish?: string;
    finalStoryEntries?: FinalStoryEntry[];
}

export class StartStory {
    storyId: string = "";
    public static Create(storyId: string) {
        let startStory = new StartStory();
        startStory.storyId = storyId;
        return startStory;
    }
}