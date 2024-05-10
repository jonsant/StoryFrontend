declare var google: any;
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { Subject } from "rxjs";


@Injectable({providedIn: 'root'})
export class StoryAuthService {
    router = inject(Router);
    authService = inject(MsalService);
    loggedIn$ = new Subject<boolean>();

    IsLoggedIn(): boolean {
        return this.authService.instance.getAllAccounts().length > 0; 
    }

    signOut() {
        sessionStorage.removeItem("user");
        this.router.navigate(['/']);
    }

    GetLoggedInStatus() {
        return this.loggedIn$.asObservable();
    }

    SetLoggedInStatus(value: boolean) {
        this.loggedIn$.next(value);
    }

}