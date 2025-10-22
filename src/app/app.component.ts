import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { jwtInterceptorFn } from './interceptors/jwt.interceptor';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: HTTP_INTERCEPTORS, useValue: jwtInterceptorFn, multi: true }
  ]
})
export class App {
  protected readonly title = signal('Personal Finance Tracker');
}
