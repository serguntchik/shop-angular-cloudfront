import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { AdminRoutingModule } from './admin-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { OrdersService } from './orders/orders.service';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { FilePickerModule } from '../shared/file-picker/file-picker.module';
import { EditProductComponent } from './edit-product/edit-product.component';

@NgModule({
  declarations: [
    OrdersComponent,
    ManageProductsComponent,
    EditProductComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FilePickerModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [OrdersService],
})
export class AdminModule {}
