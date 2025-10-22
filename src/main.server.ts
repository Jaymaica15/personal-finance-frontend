import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => {
    return bootstrapApplication(App, {
        ...config,
        providers: config.providers || []
    }, context);
}

export default bootstrap;
