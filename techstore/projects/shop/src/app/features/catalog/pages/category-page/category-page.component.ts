import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterPanelComponent } from '../../components/filter-panel/filter-panel.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CatalogApiService } from '../../data-access/catalog-api.service';
import { CatalogQueryService } from '../../data-access/catalog-query.service';

@Component({
  selector: 'app-catalog-page',
  imports: [FilterPanelComponent, PaginationComponent, ProductCardComponent],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent {
  private readonly catalogApi = inject(CatalogApiService);
  private readonly catalogQueryService = inject(CatalogQueryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Route params — resolved via withComponentInputBinding() + paramsInheritanceStrategy: 'always'
  readonly marketCode = input<string>('bg');
  readonly categorySlug = input<string | null>(null);

  // Query params
  readonly page = input(1, { transform: numberAttribute });
  readonly pageSize = input(24, { transform: numberAttribute });
  readonly sort = input<string | null>(null);
  readonly brand = input<string | null>(null);

  protected readonly catalogQuery = computed(() =>
    this.catalogQueryService.createFromInputs({
      marketCode: this.marketCode(),
      categorySlug: this.categorySlug(),
      sort: this.sort(),
      brand: this.brand(),
      page: this.page(),
      pageSize: this.pageSize(),
    }),
  );

  protected readonly catalogResource = rxResource({
    params: () => this.catalogQuery(),
    stream: ({ params }) => this.catalogApi.getProducts(params),
    defaultValue: {
      products: [],
      totalCount: 0,
      page: 1,
      pageSize: 24,
    },
  });

  protected readonly products = computed(() => this.catalogResource.value().products);
  protected readonly selectedBrands = computed(() => this.catalogQuery().selectedBrands);
  protected readonly brands = computed(() => {
    return [
      ...new Set([
        ...this.products().map((product) => product.brand),
        ...this.selectedBrands(),
      ]),
    ];
  });

  protected readonly totalPages = computed(() => {
    const response = this.catalogResource.value();

    return Math.max(1, Math.ceil(response.totalCount / response.pageSize));
  });

  protected setBrands(brands: readonly string[]): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        brand: brands.length > 0 ? brands.join(',') : null,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }
}
