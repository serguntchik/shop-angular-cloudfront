import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';

import { NotificationService } from '../../core/notification.service';
import { Product } from '../../products/product.interface';
import { ProductsService } from '../../products/products.service';

import { ManageProductsService } from './manage-products.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
})
export class ManageProductsComponent implements OnInit {
  readonly columns = ['from', 'description', 'price', 'count', 'action'];

  selectedFile: File | null = null;

  products$: Subject<Product[]> = new Subject();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly manageProductsService: ManageProductsService,
    private readonly notificationService: NotificationService,
    private readonly productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.getProductsList();
  }

  deleteProduct(productId: string): void {
    this.productsService.deleteProduct(productId).subscribe(
      () => this.getProductsList(),
      (error: HttpErrorResponse) =>
        this.notificationService.showError(error.error.message)
    );
  }

  getProductsList(): void {
    this.productsService
      .getProducts()
      .subscribe((products) => this.products$.next(products));
  }

  onUploadCSV(): void {
    if (!this.selectedFile) {
      return;
    }

    this.manageProductsService
      .uploadProductsCSV(this.selectedFile)
      .subscribe(() => {
        this.selectedFile = null;
        this.cdr.markForCheck();
      });
  }
}
