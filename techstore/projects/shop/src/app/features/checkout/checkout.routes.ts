import type { Routes } from '@angular/router';
import { ConfirmationPageComponent } from './pages/confirmation-page/confirmation-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { ShippingPageComponent } from './pages/shipping-page/shipping-page.component';

export const checkoutRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'shipping',
  },
  {
    path: 'shipping',
    component: ShippingPageComponent,
  },
  {
    path: 'payment',
    component: PaymentPageComponent,
  },
  {
    path: 'confirmation',
    component: ConfirmationPageComponent,
  },
];
