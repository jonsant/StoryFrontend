export class Story {
    storyId?: string;
    storyName?: string;
    creatorUserId?: string;
    created?: Date;
    finished?: Date;
    status?: string;
    currentPlayerInOrder?: string;
    finalStory?: string;
    invitees?: string[];
    participants?: string[];
}