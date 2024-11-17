export class Register {
    email: string = "";
    password: string = "";

    static Create(email: string, password: string,) {
        let register = new Register();
        register.email = email;
        register.password = password;
        return register;
    }
}

export class RegisterResponse {
    token: string = "";
    result: boolean = false;
    userId: string = "";
    username: string = "";
    email: string = "";
    roles: string[] = [];
    errors?: string;
}