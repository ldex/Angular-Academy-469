import { inject, Injectable, signal, Signal } from '@angular/core';
import { Product } from '../models/product';
import { ApiService } from '../api/api-service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ProductService {

  private apiService = inject(ApiService)

  private products = signal<Product[]>([]);
  private selectedProduct = signal<Product>(undefined);

  private error = signal<string>(undefined);
  errorMessage = this.error.asReadonly();

  private loading = signal(false);
  isLoading = this.loading.asReadonly();

  private loadProducts() {
    this.loading.set(true)
    this.apiService.loadProducts().subscribe(
      {
        next: (data) => {
          this.products.set(data)
          this.loading.set(false)
        },
        error: (error) => this.handleError(error, 'Failed to load products.')
      }
    )
  }

  private handleError(httpError: HttpErrorResponse, userMessage: string) {
    this.loading.set(false)
    let logMessage: string;
    if (httpError.error instanceof ErrorEvent) {
      logMessage = 'An error occurred:' + httpError.error.message;
    } else {
      logMessage = `Backend returned code ${httpError.status}, body was: ${httpError.error}`;
    }
    console.error(logMessage);
    this.error.set(userMessage);
  }

  getProducts(): Signal<Product[]> {
    if(this.products().length == 0)
      this.loadProducts()

    return this.products.asReadonly()
  }

  getProductById(id: number): Signal<Product> {
    const product = this.products().find((p) => p.id === id);

    if (!product) {
      this.loadProduct(id);
    } else {
      this.selectedProduct.set(product);
    }

    return this.selectedProduct.asReadonly();
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.apiService.loadProduct(id).subscribe({
      next: (product) => {
        this.loading.set(false);
        this.selectedProduct.set(product);
      },
      error: (err) => this.handleError(err, 'Failed to load product.'),
    });
  }

  createProduct(newProduct: Omit<Product, 'id'>): Promise<void> {
    this.apiService.createProduct(newProduct).subscribe({
      next: (product) => {
        this.products.update((products) => [...products, product]);
        console.log('Product saved on the server with id: ' + product.id);
      },
      error: (error) => {
        this.handleError(error, 'Failed to save product.');
        return Promise.reject();
      },
    });
    return Promise.resolve();
  }

  deleteProduct(id: number): Promise<void>  {
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(products => products.filter(p => p.id !== id));
        console.log('Product deleted');
      },
      error: (error) => {
         this.handleError(error, 'Failed to delete product.')
         return Promise.reject();
      }
    });

    return Promise.resolve();
  }

}
