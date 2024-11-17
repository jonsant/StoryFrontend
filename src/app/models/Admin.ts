export class AddEmail {
    email: string = "";

    public static Create(email: string) {
        let addEmail = new AddEmail();
        addEmail.email = email;
        return addEmail;
    }
}