import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.interface';

import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  createNewProduct(product: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      throw new Error(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
    }

    const url = this.getUrl('bff', 'products');
    return this.http.post<Product>(url, product);
  }

  getProductById(productId: string): Observable<Product | null> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return this.http
        .get<Product[]>('/assets/products.json')
        .pipe(
          map(
            (products) =>
              products.find((product) => product.id === productId) || null
          )
        );
    }

    const url = this.getUrl('bff', 'products', productId);
    return this.http
      .get<{ product: Product }>(url)
      .pipe(map((resp) => resp.product));
  }

  getProducts(): Observable<Product[]> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return this.http.get<Product[]>('/assets/products.json');
    }

    const idToken = new URLSearchParams(
      this.activatedRoute.snapshot.fragment!
    ).get('id_token');
    const url = this.getUrl('bff', 'products');
    let headers = new HttpHeaders();

    if (idToken) {
      headers = headers.set('Authorization', idToken);
    }

    return this.http
      .get<{ products: Product[] }>(url, { headers })
      .pipe(map((resp) => resp.products));
  }

  getProductsForCheckout(ids: string[]): Observable<Product[]> {
    if (!ids.length) {
      return of([]);
    }

    return this.getProducts().pipe(
      map((products) => products.filter((product) => ids.includes(product.id!)))
    );
  }
}
