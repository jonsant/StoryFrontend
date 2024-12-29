import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Component, Inject, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subject, Subscription, filter, lastValueFrom, takeUntil } from 'rxjs';
import { StoryAuthService } from '../services/StoryAuthService';
import { ProfileType } from '../models/ProfileType';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { UserService } from '../services/UserService';
import { CurrentUser } from '../models/User';
import { AuthenticationService } from '../services/AuthenticationService';
import { UserSignalRService } from '../services/UserSignalRService';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { InviteeService } from '../services/InviteeService';
import { StoryService } from '../services/StoryService';

export interface TabLink {
  title: string;
  icon: string;
  link: string;
}

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
    MatNavList,
    MatTabsModule,
    MatBadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  router = inject(Router);
  authenticationService = inject(AuthenticationService);
  activatedRoute = inject(ActivatedRoute);
  storyService = inject(StoryService);
  currentStoryId: string | null = null;

  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  observer = inject(BreakpointObserver);
  isCollapsed = true;
  currentUser: CurrentUser | null = null;
  currentUserUpdated$?: Subscription;
  route: ActivatedRoute = inject(ActivatedRoute);
  showCreateStoryBtn: boolean = true;
  routeChanges$?: Subscription;
  newInvite$?: Subscription;
  invitesService = inject(InviteeService);
  numberOfNewInvites: number = 0;
  // links: TabLink[] = [
  //   { title: 'Story', link: '/story' },
  //   { title: 'Stories', link: '/home' },
  //   { title: 'Invites', link: '/invites' },
  //   { title: 'Settings', link: '/settings' },
  // ];
  links: TabLink[] = [
    { title: 'Current', icon: 'history_edu', link: '/story' },
    { title: 'Stories', icon: 'list', link: '/home' },
    { title: 'Invites', icon: 'person_add', link: '/invites' },
    { title: 'Settings', icon: 'settings', link: '/settings' },
  ];
  activeLink = this.links[0];

  async ngOnInit() {

    this.currentUserUpdated$ = this.authenticationService.getCurrentUserUpdated$().subscribe(v => {
      this.currentUser = this.authenticationService.getCurrentUser();
      if (this.currentUser?.isAdmin) {
        this.links.push({ title: 'Admin', link: '/admin', icon: 'settings' });
      }

      this.newInvite$ = this.invitesService.GetNewInviteRecieved().subscribe(invite => {
        if (!this.router.url.includes('/invites')) this.numberOfNewInvites++;
      });
    });

    this.storyService.GetCurrentStoryIdUpdated$().subscribe(id => {
      this.currentStoryId = id;
    });

    this.routeChanges$ = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (val.url.startsWith('/story') ||
          val.url.startsWith('/create')) this.showCreateStoryBtn = false;
        else this.showCreateStoryBtn = true;

        if (val.url.startsWith('/invites')) this.numberOfNewInvites = 0;

        if (val.url.startsWith('/story') && this.links.findIndex(l => l.link === '/story') < 0) {
          // this.links = [{ icon: 'history_edu', link: '/story' }, ...this.links];
        }

        // let activePath = this.router.url.split('/')[-1];
        this.activeLink = this.links.find(l => this.router.url.includes(l.link)) ?? this.links[0];
      }
    });

    this.observer.observe(['(max-width: 800px)']).pipe(takeUntil(this._destroying$)).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
        console.log("isMobile ", this.isMobile);
      } else {
        this.isMobile = false;
        console.log("isMobile ", this.isMobile);
      }
    });

    // this.loggedIn$ = this.storyAuthService.GetLoggedInStatus().pipe(takeUntil(this._destroying$)).subscribe(async l => {
    //   this.isLoggedIn = l;
    //   if (this.isLoggedIn && this.profile?.id) {
    //     this.user = await lastValueFrom(this.userService.GetUserById(this.profile.id));
    //     console.log(this.user);
    //     this.userService.SetCurrentUser(this.user);
    //   }
    // });

    // this.profile$ = this.storyAuthService.GetUserProfile().pipe(takeUntil(this._destroying$)).subscribe(p => {
    //   this.profile = p;
    //   console.log("profile ", this.profile);
    // });

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
    this.router.navigate(['/home']);
  }

  GoToInvites() {
    this.router.navigate(['/invites']);
  }

  GoToAdmin() {
    this.router.navigate(['/admin']);
  }

  GoToSettings() {
    this.router.navigate(['/settings']);
  }

  CreateStory() {
    this.router.navigate(['/create']);
  }

  Login() {
    this.router.navigate(['/login']);
  }

  async Logout() {
    await this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.currentUserUpdated$ && this.currentUserUpdated$.unsubscribe();
    this.routeChanges$ && this.routeChanges$.unsubscribe();
  }
}
