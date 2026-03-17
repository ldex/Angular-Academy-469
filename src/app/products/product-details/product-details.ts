import { Component, inject, input, Signal } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { ProductService } from '../product-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, UpperCasePipe, DatePipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private productService = inject(ProductService)
  private router = inject(Router)

  product: Signal<Product>
  isLoading = this.productService.isLoading;
  error = this.productService.errorMessage;

  id = input.required<number>();

  ngOnInit() {
    this.product = this.productService.getProductById(this.id())
  }

  async deleteProduct() {
    await this.productService.deleteProduct(this.id());
    this.router.navigateByUrl('/products');
  }
}
