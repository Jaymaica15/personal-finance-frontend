import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import 'zone.js';
import { jwtInterceptorFn } from './app/interceptors/jwt.interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptorFn])),
  ]
});
