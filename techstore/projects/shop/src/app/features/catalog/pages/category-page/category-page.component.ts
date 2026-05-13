import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import type { CatalogFilterSelection } from '../../components/filter-panel/filter-panel.component';
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
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly marketCode = input<string>('bg');
  readonly categorySlug = input<string | null>(null);

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
      queryParamMap: this.queryParamMap(),
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
      facets: [],
    },
  });
  protected readonly categoriesResource = rxResource({
    stream: () => this.catalogApi.getCategories(),
    defaultValue: [],
  });

  protected readonly products = computed(() => this.catalogResource.value().products);
  protected readonly categories = computed(() => this.categoriesResource.value());
  protected readonly selectedBrands = computed(() => this.catalogQuery().selectedBrands);
  protected readonly selectedSpecFilters = computed(() => this.catalogQuery().specFilters);
  protected readonly selectedSort = computed(() => this.catalogQuery().sort);
  protected readonly selectedCategoryCode = computed(() => this.catalogQuery().categoryCode);
  protected readonly facets = computed(() => this.catalogResource.value().facets ?? []);
  protected readonly brands = computed(() => {
    if (this.facets().some((facet) => facet.code === 'manufacturer')) {
      return [];
    }

    return [...new Set([...this.products().map((product) => product.brand), ...this.selectedBrands()])];
  });

  protected readonly totalPages = computed(() => {
    const response = this.catalogResource.value();

    return Math.max(1, Math.ceil(response.totalCount / response.pageSize));
  });

  protected setFilters(filters: CatalogFilterSelection): void {
    const queryParams: Record<string, string | number | null> = {
      brand: filters.brands.length > 0 ? filters.brands.join(',') : null,
      sort: filters.sort ?? null,
      page: 1,
    };

    for (const key of this.queryParamMap().keys) {
      if (key.startsWith('spec[')) {
        queryParams[key] = null;
      }
    }

    for (const filter of filters.specFilters) {
      if (filter.type === 'range') {
        queryParams[`spec[${filter.code}][min]`] = filter.min ?? null;
        queryParams[`spec[${filter.code}][max]`] = filter.max ?? null;
      } else if (filter.type === 'in' && filter.values?.length) {
        queryParams[`spec[${filter.code}]`] = filter.values.join(',');
      } else if (filter.type === 'eq' && filter.value !== undefined) {
        queryParams[`spec[${filter.code}]`] = String(filter.value);
      }
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  protected selectCategory(categoryCode: string): void {
    void this.router.navigate(['/', this.marketCode(), 'catalog', categoryCode], {
      queryParams: {
        sort: this.selectedSort() ?? null,
        page: 1,
      },
    });
  }
}
