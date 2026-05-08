import type { Routes } from '@angular/router';
import { ProductPageComponent } from './pages/product-page/product-page.component';

export const productDetailsRoutes: Routes = [
  {
    path: '',
    component: ProductPageComponent,
  },
];
