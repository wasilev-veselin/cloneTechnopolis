import type { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';

export const routes: Routes = [
  {
    path: ':marketCode',
    component: ShellComponent,
    children: [
      {
        path: 'catalog/:categorySlug',
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then(
            (routesFile) => routesFile.catalogRoutes,
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./features/catalog/catalog.routes').then(
            (routesFile) => routesFile.catalogRoutes,
          ),
      },
      {
        path: 'product/:productSlug',
        loadChildren: () =>
          import('./features/product-details/product-details.routes').then(
            (routesFile) => routesFile.productDetailsRoutes,
          ),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./features/cart/cart.routes').then(
            (routesFile) => routesFile.cartRoutes,
          ),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then(
            (routesFile) => routesFile.checkoutRoutes,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'catalog/all',
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'bg',
  },
];
