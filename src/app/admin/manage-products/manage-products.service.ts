import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiService } from '../../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ManageProductsService extends ApiService {
  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        })
      )
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    const authorizationToken = localStorage.getItem('authorizationToken');
    const url = this.getUrl('import', 'import');
    let headers = new HttpHeaders();

    if (authorizationToken) {
      headers = headers.set('Authorization', `Basic ${authorizationToken}`);
    }

    return this.http
      .get<{ signedUrl: string }>(url, {
        headers,
        params: {
          name: fileName,
        },
      })
      .pipe(map((resp) => resp.signedUrl));
  }
}
