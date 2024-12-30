export class AddUserPushNotificationToken {
    token: string = "";

    public static Create(token: string) {
        let addUserPushNotificationToken = new AddUserPushNotificationToken();
        addUserPushNotificationToken.token = token;
        return addUserPushNotificationToken;
    }
}

export class DeleteUserPushNotificationToken {
    token: string = "";
}

export class GetUserPushNotificationToken {
    token: string = "";
    enabled: boolean = false;
}

export class ToggleUserPushNotificationToken {
    token: string = "";
    enabled: boolean = false;

    public static Create(token: string, enabled: boolean) {
        let toggleUserPushNotificationToken = new ToggleUserPushNotificationToken();
        toggleUserPushNotificationToken.token = token;
        toggleUserPushNotificationToken.enabled = enabled;
        return toggleUserPushNotificationToken;
    }
}