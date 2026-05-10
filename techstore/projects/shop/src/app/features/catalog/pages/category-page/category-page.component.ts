import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import type { ProductSummary } from '../../models/product-summary.model';

const products: ProductSummary[] = [
  {
    id: 'p-100',
    masterProductId: 'mp-100',
    marketCode: 'bg',
    locale: 'bg-BG',
    slug: 'lenovo-thinkpad',
    title: 'Lenovo ThinkPad X1 Carbon Gen',
    brand: 'Lenovo',
    categoryIds: ['laptops', 'business-laptops'],
    price: {
      current: { amount: 3699, currencyCode: 'BGN' },
      includesTax: true,
      taxRate: 20,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
      altText: 'Lenovo ThinkPad X1 Carbon Gen 13',
      role: 'primary',
    },
    availability: {
      status: 'inStock',
      storesAvailableCount: 12,
    },
    stockStatus: 'inStock',
    badges: [{ code: 'business-choice', label: 'Business choice', tone: 'success' }],
  },
  {
    id: 'p-101',
    masterProductId: 'mp-101',
    marketCode: 'bg',
    locale: 'bg-BG',
    slug: 'sony-wh-1000xm6',
    title: 'Sony WH-1000XM6 Noise Canceling Headphones',
    brand: 'Sony',
    categoryIds: ['audio', 'headphones'],
    price: {
      current: { amount: 829, currencyCode: 'BGN' },
      original: { amount: 899, currencyCode: 'BGN' },
      discountPercent: 8,
      includesTax: true,
      taxRate: 20,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      altText: 'Sony WH-1000XM6 Noise Canceling Headphones',
      role: 'primary',
    },
    availability: {
      status: 'limited',
      quantity: 4,
    },
    stockStatus: 'limited',
    badges: [{ code: 'promo', label: 'Promo', tone: 'warning' }],
  },
  {
    id: 'p-102',
    masterProductId: 'mp-102',
    marketCode: 'bg',
    locale: 'bg-BG',
    slug: 'samsung-odyssey-oled',
    title: 'Samsung Odyssey OLED 32 Gaming Monitor',
    brand: 'Samsung',
    categoryIds: ['monitors', 'gaming-monitors'],
    price: {
      current: { amount: 2199, currencyCode: 'BGN' },
      includesTax: true,
      taxRate: 20,
    },
    image: {
      url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
      altText: 'Samsung Odyssey OLED 32 Gaming Monitor',
      role: 'primary',
    },
    availability: {
      status: 'onlineOnly',
      estimatedDeliveryDate: '2026-05-14',
    },
    stockStatus: 'inStock',
    badges: [{ code: 'online-only', label: 'Online only', tone: 'neutral' }],
  },
];

@Component({
  selector: 'app-catalog-page',
  imports: [
    FilterPanelComponent,
    PaginationComponent,
    ProductCardComponent,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CatalogPageComponent {
  protected readonly products = signal(products);
  protected readonly brands = computed(() => [
    ...new Set(this.products().map((product) => product.brand)),
  ]);
}
