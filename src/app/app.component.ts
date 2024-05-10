import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        RouterOutlet,
        MatSlideToggleModule,
        NavbarComponent
    ]
})
export class AppComponent {
  title = 'StoryFrontend';

  // isIframe = false;
  // loginDisplay = false;
  // private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    // this.authService.handleRedirectObservable().subscribe();

    // this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal
    // this.setLoginDisplay();

    // this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
    //   )
    //   .subscribe((result: EventMessage) => {
    //     if (this.authService.instance.getAllAccounts().length === 0) {
    //       window.location.pathname = "/";
    //     } else {
    //       this.setLoginDisplay();
    //     }
    //   });
    
    // this.msalBroadcastService.inProgress$
    //   .pipe(
    //     filter((status: InteractionStatus) => status === InteractionStatus.None),
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe(() => {
    //     this.setLoginDisplay();
    //     this.checkAndSetActiveAccount();
    //   })
  }

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  // checkAndSetActiveAccount(){
  //   /**
  //    * If no active account set but there are accounts signed in, sets first account to active account
  //    * To use active account set here, subscribe to inProgress$ first in your component
  //    * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
  //    */
  //   let activeAccount = this.authService.instance.getActiveAccount();

  //   if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
  //     let accounts = this.authService.instance.getAllAccounts();
  //     this.authService.instance.setActiveAccount(accounts[0]);
  //   }
  // }

  // loginRedirect() {
  //   if (this.msalGuardConfig.authRequest){
  //     this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
  //   } else {
  //     this.authService.loginRedirect();
  //   }
  // }

  // loginPopup() {
  //   if (this.msalGuardConfig.authRequest){
  //     this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
  //       .subscribe((response: AuthenticationResult) => {
  //         this.authService.instance.setActiveAccount(response.account);
  //       });
  //     } else {
  //       this.authService.loginPopup()
  //         .subscribe((response: AuthenticationResult) => {
  //           this.authService.instance.setActiveAccount(response.account);
  //     });
  //   }
  // }

  // logout(popup?: boolean) {
  //   if (popup) {
  //     this.authService.logoutPopup({
  //       mainWindowRedirectUri: "/"
  //     });
  //   } else {
  //     this.authService.logoutRedirect();
  //   }
  // }

  // ngOnDestroy(): void {
  //   this._destroying$.next(undefined);
  //   this._destroying$.complete();
  // }
}
