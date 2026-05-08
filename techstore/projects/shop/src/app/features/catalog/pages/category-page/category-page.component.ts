import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SortDropdownComponent } from '../../components/sort-dropdown/sort-dropdown.component';
import type { ProductSummary } from '../../models/product-summary.model';

const products: ProductSummary[] = [
  {
    id: 'p-100',
    slug: 'lenovo-thinkpad-x1',
    title: 'Lenovo ThinkPad X1 Carbon Gen 13',
    brand: 'Lenovo',
    price: { amount: 3699, currencyCode: 'BGN' },
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    stockStatus: 'inStock',
  },
  {
    id: 'p-101',
    slug: 'sony-wh-1000xm6',
    title: 'Sony WH-1000XM6 Noise Canceling Headphones',
    brand: 'Sony',
    price: { amount: 829, currencyCode: 'BGN' },
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    stockStatus: 'limited',
  },
  {
    id: 'p-102',
    slug: 'samsung-odyssey-oled',
    title: 'Samsung Odyssey OLED 32 Gaming Monitor',
    brand: 'Samsung',
    price: { amount: 2199, currencyCode: 'BGN' },
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    stockStatus: 'inStock',
  },
];

@Component({
  selector: 'app-category-page',
  imports: [
    FilterPanelComponent,
    PaginationComponent,
    ProductCardComponent,
    SortDropdownComponent,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent {
  protected readonly products = signal(products);
  protected readonly brands = computed(() => [
    ...new Set(this.products().map((product) => product.brand)),
  ]);
}
