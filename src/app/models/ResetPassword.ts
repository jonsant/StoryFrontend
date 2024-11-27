export class ResetPassword {
    email: string = "";
    newPassword: string = "";
    token: string = "";

    public static Create(email: string, newPassword: string, token: string) {
        let rp: ResetPassword = new ResetPassword();
        rp.email = email;
        rp.newPassword = newPassword;
        rp.token = token;
        return rp;
    }
}

export class ResetPasswordEmailRequest {
    email: string = "";

    public static Create(email: string) {
        let rper = new ResetPasswordEmailRequest();
        rper.email = email;
        return rper;
    }
}