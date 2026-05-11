import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { isApplicationError } from '../../../../core/errors/application-error';
import { CartStore } from '../../../cart/store/cart.store';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { ProductPricePanelComponent } from '../../components/product-price-panel/product-price-panel.component';
import { RelatedProductsComponent } from '../../components/related-products/related-products.component';
import { SpecsTableComponent } from '../../components/specs-table/specs-table.component';
import { VariantSelectorComponent } from '../../components/variant-selector/variant-selector.component';
import { ProductDetailsApiService } from '../../data-access/product-details-api.service';
import type { ProductDetailsModel } from '../../models/product-details.model';

const getDefaultSku = (product: ProductDetailsModel | null): string | null =>
  product?.variants.find((variant) => variant.isDefault)?.sku ??
  product?.variants[0]?.sku ?? 
  null;

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
  private readonly productDetailsApiService = inject(ProductDetailsApiService);

  readonly productSlug = input.required<string>();

  protected readonly productResource = resource<ProductDetailsModel, string>({
    params: () => this.productSlug(),
    loader: ({ params }) => lastValueFrom(this.productDetailsApiService.getProduct(params)),
  });

  // Reads the API error state so the template can show a specific "not found" message.
  protected readonly isProductNotFound = computed(() => {
    const error = this.productResource.error();

    return isApplicationError(error) && error.code === 'NOT_FOUND';
  });

  protected readonly product = computed(() =>
    this.productResource.hasValue() ? this.productResource.value() : null,
  );

  // linkedSignal resets selectedSku whenever a different product loads.
  protected readonly selectedSku = linkedSignal(() => getDefaultSku(this.product()));

  protected readonly selectedVariant = computed(() =>
    this.product()?.variants.find((variant) => variant.sku === this.selectedSku()),
  );

  protected readonly selectedAvailability = computed(
    () => this.selectedVariant()?.availability ?? this.product()?.availability ?? null,
  );

  protected readonly quantity = computed(
    () =>
      this.selectedAvailability()?.storesAvailableCount ??
      this.selectedAvailability()?.quantity ??
      null,
  );

  protected readonly availabilityStatus = computed(
    () => this.selectedAvailability()?.status ?? 'outOfStock',
  );

  protected readonly cartQuantity = computed(() => {
    const selectedSku = this.selectedSku();

    if (!selectedSku) {
      return 0;
    }

    return this.cartStore.items().find((item) => item.sku === selectedSku)?.quantity ?? 0;
  });

  protected readonly canAddToCart = computed(() => {
    const quantity = this.quantity();

    if (this.availabilityStatus() === 'outOfStock' || quantity === 0) {
      return false;
    }

    if (quantity === null) {
      return true;
    }

    return this.cartQuantity() < quantity;
  });

  protected readonly selectedPrice = computed(
    () => this.selectedVariant()?.price ?? this.product()?.price ?? null,
  );

  protected addToCart(): void {
    const currentProduct = this.product();
    const currentPrice = this.selectedPrice();
    const selectedSku = this.selectedSku();

    if (!currentProduct || !currentPrice || !selectedSku) {
      return;
    }

    if (!this.canAddToCart()) {
      return;
    }

    this.cartStore.addItem({
      productId: currentProduct.id,
      sku: selectedSku,
      title: currentProduct.title,
      brand: currentProduct.brand,
      unitPrice: currentPrice.current,
      imageUrl: currentProduct.images[0]?.url,
    });
  }
}
