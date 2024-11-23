export class NewUsername {
    newUsername: string = "";

    public static Create(newUsername: string): NewUsername {
        let newName = new NewUsername();
        newName.newUsername = newUsername;
        return newName;
    }
}