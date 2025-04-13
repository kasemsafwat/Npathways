import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cloned = req.clone({
      withCredentials: true,
    });

    return next.handle(cloned);
  }
}

export function withCredentialsInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const cloned = req.clone({
    withCredentials: true,
  });

  return next(cloned);
}
