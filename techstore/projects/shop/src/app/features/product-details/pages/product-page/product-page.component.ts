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
import { CartStore } from '../../../cart/store/cart.store';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { ProductPricePanelComponent } from '../../components/product-price-panel/product-price-panel.component';
import { RelatedProductsComponent } from '../../components/related-products/related-products.component';
import { SpecsTableComponent } from '../../components/specs-table/specs-table.component';
import { VariantSelectorComponent } from '../../components/variant-selector/variant-selector.component';
import {
  ProductDetailsApiService,
  ProductNotFoundError,
} from '../../data-access/product-details-api.service';
import type { ProductDetailsModel } from '../../models/product-details.model';

type ProductState =
  | { status: 'loading' }
  | { status: 'loaded'; product: ProductDetailsModel }
  | { status: 'notFound' }
  | { status: 'error' };

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

  readonly marketCode = input.required<string>();
  readonly productSlug = input.required<string>();

  private readonly productResource = resource<ProductDetailsModel, string>({
    params: () => this.productSlug(),
    loader: ({ params }) => lastValueFrom(this.productDetailsApiService.getProduct(params)),
  });

  protected readonly productState = computed((): ProductState => {
    const status = this.productResource.status();

    if (status === 'loading' || status === 'idle') return { status: 'loading' };
    if (status === 'error') {
      return {
        status: this.productResource.error() instanceof ProductNotFoundError ? 'notFound' : 'error',
      };
    }

    return { status: 'loaded', product: this.productResource.value()! };
  });

  protected readonly product = computed(() => {
    const state = this.productState();

    return state.status === 'loaded' ? state.product : null;
  });

  protected readonly quantity = linkedSignal({
    source: () => this.product()?.id,
    computation: () => 1,
  });
  protected readonly selectedSku = linkedSignal(() => getDefaultSku(this.product()));
  protected readonly selectedVariant = computed(() =>
    this.product()?.variants.find((variant) => variant.sku === this.selectedSku()),
  );
  protected readonly selectedPrice = computed(
    () => this.selectedVariant()?.price ?? this.product()?.price ?? null,
  );

  protected addToCart(): void {
    const currentProduct = this.product();
    const currentPrice = this.selectedPrice();

    if (!currentProduct || !currentPrice) {
      return;
    }

    this.cartStore.addItem({
      productId: currentProduct.id,
      sku: this.selectedSku() ?? '',
      title: currentProduct.title,
      brand: currentProduct.brand,
      unitPrice: currentPrice.current,
      quantity: this.quantity(),
      imageUrl: currentProduct.images[0]?.url,
    });
  }
}
