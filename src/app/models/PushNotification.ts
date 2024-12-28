export class AddUserPushNotificationToken {
    token: string = "";

    public static Create(token: string) {
        const addUserPushNotificationToken = new AddUserPushNotificationToken();
        addUserPushNotificationToken.token = token;
        return addUserPushNotificationToken;
    }
}