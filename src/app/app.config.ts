import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './interceptors/AuthInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, MatButtonModule, MatToolbarModule, MatListModule, MatMenuModule),
    importProvidersFrom(BrowserModule),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideAnimations(),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};