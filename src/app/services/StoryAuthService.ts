declare var google: any;
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MsalService } from "@azure/msal-angular";
import { Subject, lastValueFrom, startWith } from "rxjs";
import { environment } from '../../environments/environment';
import { ProfileType } from "../models/ProfileType";

@Injectable({ providedIn: 'root' })
export class StoryAuthService {
    router = inject(Router);
    httpClient = inject(HttpClient);
    authService = inject(MsalService);
    loggedIn$ = new Subject<boolean>();
    loggedIn: boolean = false;
    // profile: ProfileType | undefined;
    profile$ = new Subject<ProfileType | undefined>();
    profile?: ProfileType;

    constructor() {
        this.checkLoggedIn();
    }

    async checkLoggedIn() {
        const isLoggedIn = this.authService.instance.getAllAccounts().length > 0;
        if (isLoggedIn) {
            await this.fetchProfileType();
        }
        this.SetLoggedInStatus(isLoggedIn);
    }

    // SignOut() {
    //     sessionStorage.removeItem("user");
    //     this.setProfile(undefined);
    //     this.router.navigate(['/']);
    // }

    GetLoggedInStatus() {
        return this.loggedIn$.asObservable().pipe(startWith(this.loggedIn));
    }

    SetLoggedInStatus(value: boolean) {
        this.loggedIn = value;
        this.loggedIn$.next(this.loggedIn);
    }

    GetUserProfile() {
        return this.profile$.asObservable().pipe(startWith(this.profile));
    }

    private setProfile(profile: ProfileType | undefined) {
        this.profile = profile;
        this.profile$.next(this.profile);
    }

    private async fetchProfileType(): Promise<ProfileType> {
        const fromStorage = sessionStorage.getItem("user");
        let output: ProfileType;
        if (fromStorage === null) {
            let profile = await lastValueFrom(this.httpClient.get(environment.apiConfig.uri)) as ProfileType;
            sessionStorage.setItem("user", JSON.stringify(profile));
            output = profile;
        }
        else {
            const profileType = JSON.parse(fromStorage) as ProfileType;
            output = profileType;
        }
        this.setProfile(output);
        return output;
    }

}