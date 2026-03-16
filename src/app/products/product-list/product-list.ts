import { Component, inject, Signal, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ProductDetails } from '../product-details/product-details';
import { ProductService } from '../product-service';
import { OrderByPipe } from '../orderBy.pipe';

@Component({
  selector: 'app-product-list',
  imports: [UpperCasePipe, CurrencyPipe, ProductDetails, OrderByPipe, SlicePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(ProductService)

  // Pagination
  pageSize = signal(5)
  start = signal(0)
  end = signal(this.pageSize())
  pageNumber = signal(1)

  changePage(increment: number) {
    this.selectedProduct.set(undefined)
    this.pageNumber.update(p => p + increment)
    this.start.update(s => s + increment * this.pageSize())
    this.end.set(this.start() + this.pageSize())
  }


  isLoading = this.productService.isLoading;
  errorMessage = this.productService.errorMessage;

  selectedProduct = signal<Product>(undefined);

  select(product: Product): void {
    this.selectedProduct.set(product)
  }

  title = signal('Products')

  products: Signal<Product[]> = this.productService.getProducts()

}
