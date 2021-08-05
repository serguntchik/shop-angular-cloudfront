import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './product.interface';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  createNewProduct(product: Product): Observable<Product> {
    if (!this.endpointEnabled('products')) {
      throw new Error(
        'Endpoint "products" is disabled. To enable change your environment.ts config'
      );
    }

    const url = this.getUrl('products', 'products');
    return this.http.post<Product>(url, product);
  }

  getProductById(productId: string): Observable<Product | null> {
    if (!this.endpointEnabled('products')) {
      console.warn(
        'Endpoint "products" is disabled. To enable change your environment.ts config'
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

    const url = this.getUrl('products', 'products', productId);
    return this.http
      .get<{ product: Product }>(url)
      .pipe(map((resp) => resp.product));
  }

  getProducts(): Observable<Product[]> {
    if (!this.endpointEnabled('products')) {
      console.warn(
        'Endpoint "products" is disabled. To enable change your environment.ts config'
      );
      return this.http.get<Product[]>('/assets/products.json');
    }

    const url = this.getUrl('products', 'products');
    return this.http
      .get<{ products: Product[] }>(url)
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
