import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  ...appConfig,
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),    // garante HttpClient em SSR
    ...(appConfig.providers || [])
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
