import { Component, inject, Signal, signal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';
import { OrderByPipe } from '../orderBy.pipe';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [UpperCasePipe, CurrencyPipe, OrderByPipe, SlicePipe, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export default class ProductList {
  private productService = inject(ProductService)
  private router = inject(Router)

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
    this.router.navigate(['/products', product.id])
  }

  title = signal('Products')

  products: Signal<Product[]> = this.productService.getProducts()

}
