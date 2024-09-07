import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subject, Subscription, filter, lastValueFrom, takeUntil } from 'rxjs';
import { StoryAuthService } from '../services/StoryAuthService';
import { ProfileType } from '../models/ProfileType';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { UserService } from '../services/UserService';
import { User } from '../models/User';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatSidenavModule,
    MatNavList
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  isLoggedIn: boolean = false;
  loggedIn$ = new Subscription();
  profile?: ProfileType;
  profile$ = new Subscription();
  router = inject(Router);

  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  observer = inject(BreakpointObserver);
  isCollapsed = true;
  user?: User;

  constructor(
    private storyAuthService: StoryAuthService,
    private userService: UserService
  ) {
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }

  GoHome() {
    // this.router.navigate(['/signup']);
  }

  GoToInvites() {
    this.router.navigate(['/home']);
  }

  CreateStory() {
    this.router.navigate(['/create']);
  }

  async ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).pipe(takeUntil(this._destroying$)).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
        console.log("isMobile ", this.isMobile);
      } else {
        this.isMobile = false;
        console.log("isMobile ", this.isMobile);
      }
    });

    this.loggedIn$ = this.storyAuthService.GetLoggedInStatus().pipe(takeUntil(this._destroying$)).subscribe(async l => {
      this.isLoggedIn = l;
      if (this.isLoggedIn && this.profile?.id) {
        this.user = await lastValueFrom(this.userService.GetUserById(this.profile.id));
        console.log(this.user);
        this.userService.SetCurrentUser(this.user);
      }
    });

    this.profile$ = this.storyAuthService.GetUserProfile().pipe(takeUntil(this._destroying$)).subscribe(p => {
      this.profile = p;
      console.log("profile ", this.profile);
    });

  }

  Login() {
    this.router.navigate(['/login']);
  }

  Logout() {

  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    if (this.loggedIn$) this.loggedIn$.unsubscribe();
    if (this.profile$) this.profile$.unsubscribe();
  }
}
