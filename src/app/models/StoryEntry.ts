export class CreateEntry {
    storyId: string = "";
    first: string = "";
    second: string = "";
    endStory: boolean = false;

    public static Create(storyId: string, first: string, second: string, endStory: boolean) {
        let entry = new CreateEntry();
        entry.storyId = storyId;
        entry.first = first;
        entry.second = second;
        entry.endStory = endStory;
        return entry;
    }
}

export class FinalStoryEntry {
    username: string = "";
    text: string = "";
}