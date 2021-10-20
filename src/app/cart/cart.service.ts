import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Cart } from './cart.interface';

import { ApiService } from '../core/api.service';
import { Product } from '../products/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  /** Key - item id, value - ordered amount */
  #cartSource = new BehaviorSubject<Cart>({ id: '', items: [] });

  cart$ = this.#cartSource.asObservable();

  totalInCart$: Observable<number> = this.cart$.pipe(
    map((cart) => cart.items.length),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  constructor(
    protected readonly activatedRoute: ActivatedRoute,
    protected readonly injector: Injector
  ) {
    super(activatedRoute, injector);

    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      return;
    }

    const url = this.getUrl('bff', 'cart');
    this.http
      .get<{ data: { cart: Cart } }>(url)
      .subscribe(({ data: { cart } }) => this.#cartSource.next(cart));
  }

  addItem(product: Product): void {
    this.updateCount(product, 1);
  }

  removeItem(product: Product): void {
    this.updateCount(product, -1);
  }

  empty(): void {
    const cart = this.#cartSource.getValue();
    this.#cartSource.next({ id: cart.id, items: [] });
  }

  private updateCount(product: Product, type: 1 | -1): void {
    const { id, items } = this.#cartSource.getValue();
    const cartItem = items.find((item) => item.product.id === product.id);

    if (!cartItem) {
      items.push({ product, count: 1 });
    } else {
      cartItem.count += type;
    }

    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config'
      );
      this.#cartSource.next({ id, items });
      return;
    }

    const body = { id, items: items.filter((item) => item.count > 0) };
    const url = this.getUrl('bff', 'cart');
    this.http
      .put<{ data: { cart: Cart } }>(url, body)
      .subscribe(({ data: { cart } }) => this.#cartSource.next(cart));
  }
}
