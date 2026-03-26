import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_EMPLOYEES } from '../../mock-data';
import { MOCK_PROJECTS } from '../../mock-data';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/employees')) {
    return of(
      new HttpResponse({ status: 200, body: MOCK_EMPLOYEES })
    ).pipe(delay(200));
  }

  if (req.url.includes('/api/projects')) {
    return of(
      new HttpResponse({ status: 200, body: MOCK_PROJECTS })
    ).pipe(delay(200));
  }

  return next(req);
};
