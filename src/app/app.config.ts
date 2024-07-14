import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              provideHttpClient(),
              provideToastr(), // Toastr providers
              provideAnimations(), provideAnimationsAsync(), // required animations providers,
              ]
};
