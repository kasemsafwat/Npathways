import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { withCredentialsInterceptor } from './with-credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([withCredentialsInterceptor])),
    AuthService,
    provideCharts(withDefaultRegisterables()),
  ],
};
