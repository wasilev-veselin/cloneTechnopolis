import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { ProductPricePanelComponent } from '../../components/product-price-panel/product-price-panel.component';
import { RelatedProductsComponent } from '../../components/related-products/related-products.component';
import { SpecsTableComponent } from '../../components/specs-table/specs-table.component';
import { VariantSelectorComponent } from '../../components/variant-selector/variant-selector.component';
import { CartStore } from '../../../cart/store/cart.store';
import type { ProductDetails } from '../../models/product-details.model';

const product: ProductDetails = {
  id: 'p-100',
  slug: 'lenovo-thinkpad-x1',
  title: 'Lenovo ThinkPad X1 Carbon Gen 13',
  brand: 'Lenovo',
  description:
    'Лек бизнес лаптоп с OLED дисплей, дълъг живот на батерията и корпус, подходящ за ежедневно носене.',
  price: { amount: 3699, currencyCode: 'BGN' },
  images: [
    {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80',
      altText: 'Lenovo ThinkPad лаптоп върху бюро',
    },
    {
      url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      altText: 'Лаптоп отворен върху работно място',
    },
  ],
  specs: [
    { label: 'Процесор', value: 'Intel Core Ultra 7' },
    { label: 'Памет', value: '32 GB LPDDR5x' },
    { label: 'Диск', value: '1 TB NVMe SSD' },
    { label: 'Дисплей', value: '14 inch OLED, 120 Hz' },
  ],
  variants: [
    { id: 'v-1', label: '32GB / 1TB', sku: 'X1-32-1TB', available: true },
    { id: 'v-2', label: '16GB / 512GB', sku: 'X1-16-512', available: true },
    { id: 'v-3', label: '64GB / 2TB', sku: 'X1-64-2TB', available: false },
  ],
  stockStatus: 'inStock',
};

@Component({
  selector: 'app-product-page',
  imports: [
    GalleryComponent,
    ProductPricePanelComponent,
    RelatedProductsComponent,
    SpecsTableComponent,
    VariantSelectorComponent,
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent {
  private readonly cartStore = inject(CartStore);

  protected readonly product = signal(product);
  protected readonly quantity = signal(1);
  protected readonly selectedSku = signal(product.variants[0]?.sku ?? null);
  protected readonly selectedVariant = computed(() =>
    this.product().variants.find((variant) => variant.sku === this.selectedSku()),
  );

  protected addToCart(): void {
    const currentProduct = this.product();

    this.cartStore.addItem({
      productId: currentProduct.id,
      sku: this.selectedVariant()?.sku ?? currentProduct.slug,
      title: currentProduct.title,
      brand: currentProduct.brand,
      unitPrice: currentProduct.price,
      quantity: this.quantity(),
      imageUrl: currentProduct.images[0]?.url,
    });
  }
}
