import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationService } from '../notification.service';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error.error.message, 0);
        throw error;
      })
    );
  }
}
