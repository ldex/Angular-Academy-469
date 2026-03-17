import { Routes } from '@angular/router';
import { Home } from './shared/home';
import { Contact } from './shared/contact';
import { Admin } from './shared/admin';
import { ErrorPage } from './shared/error';
import { ProductDetails } from './products/product-details/product-details';
import { ProductForm } from './products/product-form/product-form';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'products', children: [
        { path: '', loadComponent: () => import('./products/product-list/product-list') },
        { path: 'create', component: ProductForm },
        { path: ':id', component: ProductDetails },
    ]},
    { path: 'contact', component: Contact },
    { path: 'admin', component: Admin },
    { path: '**', component: ErrorPage }
];
