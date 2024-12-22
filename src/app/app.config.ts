import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
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
import { CacheRouteReuseStrategy } from './CustomRouteReuseStrategy';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, MatButtonModule, MatToolbarModule, MatListModule, MatMenuModule),
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy },
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000'
    }), provideFirebaseApp(() => initializeApp({"projectId":"storyfrontend-pwa","appId":"1:582938887093:web:d05ac52729d89f6a774ffc","storageBucket":"storyfrontend-pwa.firebasestorage.app","apiKey":"AIzaSyAoyYKjh2Mvr2BZ9PlVASMfz4k0Pffxr9I","authDomain":"storyfrontend-pwa.firebaseapp.com","messagingSenderId":"582938887093","measurementId":"G-1621V7KCKC"})), provideMessaging(() => getMessaging())
  ]
};