import type { Routes } from '@angular/router';
import { CategoryPageComponent } from './pages/category-page/category-page.component';

export const catalogRoutes: Routes = [
  {
    path: '',
    component: CategoryPageComponent,
  },
];
