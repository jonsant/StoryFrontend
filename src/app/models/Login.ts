export class Login {
    email: string = "";
    password: string = "";

    static Create(email: string, password: string) {
        let login = new Login();
        login.email = email;
        login.password = password;
        return login;
    }
}

export class LoginResponse {
    token: string = "";
    result: boolean = false;
    userId: string = "";
    username: string = "";
    email: string = "";
    roles: string[] = [];
    errors?: string;
}