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
    this.loadProducts()
    return this.products.asReadonly()
  }

}
