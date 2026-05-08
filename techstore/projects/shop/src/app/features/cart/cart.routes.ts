import type { Routes } from '@angular/router';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const cartRoutes: Routes = [
  {
    path: '',
    component: CartPageComponent,
  },
];
