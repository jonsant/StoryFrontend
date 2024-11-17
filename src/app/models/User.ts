export class CurrentUser {
    token: string = "";
    userId: string = "";
    username?: string;
    email?: string;
    roles: string[] = [];
    isAdmin: boolean = false;

    public static Create(token: string, userId: string, username: string, email: string, roles: string[]) {
        let currentUser = new CurrentUser();
        currentUser.token = token;
        currentUser.userId = userId;
        currentUser.username = username;
        currentUser.email = email;
        currentUser.roles = roles;
        currentUser.isAdmin = currentUser.roles.includes('Admin');
        return currentUser;
    }
}

export class GetUser {
    userId: string = "";
    username: string = "";
}