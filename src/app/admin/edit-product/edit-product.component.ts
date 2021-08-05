import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Product } from '../../products/product.interface';
import { ProductsService } from '../../products/products.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductComponent implements OnInit, OnDestroy {
  form$: BehaviorSubject<FormGroup | null> =
    new BehaviorSubject<FormGroup | null>(null);
  product: Product | null = null;
  requestInProgress = false;

  private readonly onDestroy$: Subject<void> = new Subject();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly productsService: ProductsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((paramMap) =>
          paramMap.has('productId')
            ? this.productsService.getProductById(paramMap.get('productId')!)
            : of(null)
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe((product) => {
        this.product = product;
        this.buildForm();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  editProduct(): void {
    const product: Product = this.form$.value!.value;
    this.requestInProgress = true;

    if (!this.product) {
      this.productsService.createNewProduct(product).subscribe(
        () =>
          this.router.navigate(['../'], { relativeTo: this.activatedRoute }),
        () => (this.requestInProgress = false)
      );
    }
  }

  private buildForm(): void {
    this.form$.next(
      this.fb.group({
        title: [this.product?.title, Validators.required],
        description: [this.product?.description, Validators.required],
        price: [this.product?.price, Validators.required],
        count: [this.product?.count, Validators.required],
      })
    );
  }
}
