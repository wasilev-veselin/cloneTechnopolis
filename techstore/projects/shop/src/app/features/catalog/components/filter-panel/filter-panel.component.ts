import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import type { CatalogCategoryNode, CatalogFacet } from '../../data-access/catalog-api.service';
import type { CatalogSort, SpecFilter } from '../../models/catalog-query.model';

export interface CatalogFilterSelection {
  brands: readonly string[];
  specFilters: readonly SpecFilter[];
  sort?: CatalogSort;
}

interface RangeSelection {
  min: string;
  max: string;
}

const SORT_OPTIONS: readonly { value: CatalogSort; label: string }[] = [
  { value: 'price-asc', label: 'Цена: ниска към висока' },
  { value: 'price-desc', label: 'Цена: висока към ниска' },
  { value: 'rating-desc', label: 'Най-висок рейтинг' },
];

@Component({
  selector: 'app-filter-panel',
  imports: [],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  readonly brands = input.required<readonly string[]>();
  readonly selectedBrands = input<readonly string[]>([]);
  readonly facets = input<readonly CatalogFacet[]>([]);
  readonly categories = input<readonly CatalogCategoryNode[]>([]);
  readonly selectedCategoryCode = input<string | null>(null);
  readonly selectedSpecFilters = input<readonly SpecFilter[]>([]);
  readonly selectedSort = input<CatalogSort | undefined>();

  readonly filtersApplied = output<CatalogFilterSelection>();
  readonly categorySelected = output<string>();

  protected readonly pendingBrands = linkedSignal({
    source: () => this.selectedBrands(),
    computation: (selectedBrands) => new Set(selectedBrands),
  });
  protected readonly pendingMultiSelectFilters = linkedSignal({
    source: () => ({
      filters: this.selectedSpecFilters(),
      facets: this.facets(),
    }),
    computation: ({ filters, facets }) => {
      const selections = new Map<string, Set<string>>();
      const multiSelectFacetCodes = new Set(
        facets
          .filter((facet) => facet.type === 'multiSelect')
          .map((facet) => facet.code),
      );

      for (const filter of filters) {
        if (filter.type === 'in') {
          selections.set(filter.code, new Set(filter.values ?? []));
        } else if (
          filter.type === 'eq' &&
          filter.value !== undefined &&
          multiSelectFacetCodes.has(filter.code)
        ) {
          selections.set(filter.code, new Set([String(filter.value)]));
        }
      }

      return selections;
    },
  });
  protected readonly pendingSingleSelectFilters = linkedSignal({
    source: () => ({
      filters: this.selectedSpecFilters(),
      facets: this.facets(),
    }),
    computation: ({ filters, facets }) => {
      const selections = new Map<string, string>();

      for (const filter of filters) {
        const isMultiSelectFacet = facets.some(
          (facet) => facet.code === filter.code && facet.type === 'multiSelect',
        );

        if (filter.type === 'eq' && filter.value !== undefined && !isMultiSelectFacet) {
          selections.set(filter.code, String(filter.value));
        }
      }

      return selections;
    },
  });
  protected readonly pendingRangeFilters = linkedSignal({
    source: () => this.selectedSpecFilters(),
    computation: (filters) => {
      const selections = new Map<string, RangeSelection>();

      for (const filter of filters) {
        if (filter.type === 'range') {
          selections.set(filter.code, {
            min: filter.min?.toString() ?? '',
            max: filter.max?.toString() ?? '',
          });
        }
      }

      return selections;
    },
  });
  protected readonly pendingSort = linkedSignal(() => this.selectedSort());
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly hasFilters = computed(
    () =>
      this.categories().length > 0 ||
      this.brands().length > 0 ||
      this.facets().length > 0 ||
      this.sortOptions.length > 0,
  );
  protected readonly hasPendingSelection = computed(
    () =>
      this.pendingBrands().size > 0 ||
      this.pendingMultiSelectFilters().size > 0 ||
      this.pendingSingleSelectFilters().size > 0 ||
      this.pendingRangeFilters().size > 0 ||
      this.pendingSort() !== undefined,
  );

  protected toggleBrand(brand: string): void {
    this.pendingBrands.update((current) => {
      const next = new Set(current);

      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.add(brand);
      }

      return next;
    });
  }

  protected toggleMultiSelectFilter(code: string, value: string): void {
    this.pendingMultiSelectFilters.update((current) => {
      const next = new Map(current);
      const values = new Set(next.get(code) ?? []);

      if (values.has(value)) {
        values.delete(value);
      } else {
        values.add(value);
      }

      if (values.size > 0) {
        next.set(code, values);
      } else {
        next.delete(code);
      }

      return next;
    });
  }

  protected setSingleSelectFilter(code: string, value: string): void {
    this.pendingSingleSelectFilters.update((current) => {
      const next = new Map(current);
      next.set(code, value);

      return next;
    });
  }

  protected clearSingleSelectFilter(code: string): void {
    this.pendingSingleSelectFilters.update((current) => {
      const next = new Map(current);
      next.delete(code);

      return next;
    });
  }

  protected setRangeFilter(code: string, bound: keyof RangeSelection, value: string): void {
    this.pendingRangeFilters.update((current) => {
      const next = new Map(current);
      const range = next.get(code) ?? { min: '', max: '' };
      const updatedRange = this.normalizeRangeSelection({ ...range, [bound]: value });

      if (updatedRange.min || updatedRange.max) {
        next.set(code, updatedRange);
      } else {
        next.delete(code);
      }

      return next;
    });
  }

  protected getRangeMin(facet: CatalogFacet): number {
    return facet.min ?? 0;
  }

  protected getRangeMax(facet: CatalogFacet): number {
    return facet.max ?? 100;
  }

  protected getRangeStep(facet: CatalogFacet): number {
    return facet.step ?? 1;
  }

  protected getRangeLowerValue(facet: CatalogFacet): number {
    const rawValue = this.pendingRangeFilters().get(facet.code)?.min;
    const value = Number(rawValue);

    return rawValue && Number.isFinite(value) ? value : this.getRangeMin(facet);
  }

  protected getRangeUpperValue(facet: CatalogFacet): number {
    const rawValue = this.pendingRangeFilters().get(facet.code)?.max;
    const value = Number(rawValue);

    return rawValue && Number.isFinite(value) ? value : this.getRangeMax(facet);
  }

  protected setSort(value: string): void {
    this.pendingSort.set(this.toCatalogSort(value));
  }

  protected selectCategory(categoryCode: string): void {
    this.categorySelected.emit(categoryCode);
  }

  protected applyFilters(): void {
    this.filtersApplied.emit({
      brands: [...this.pendingBrands()],
      specFilters: this.createSpecFilters(),
      sort: this.pendingSort(),
    });
  }

  protected clearFilters(): void {
    this.pendingBrands.set(new Set());
    this.pendingMultiSelectFilters.set(new Map());
    this.pendingSingleSelectFilters.set(new Map());
    this.pendingRangeFilters.set(new Map());
    this.pendingSort.set(undefined);
    this.filtersApplied.emit({
      brands: [],
      specFilters: [],
      sort: undefined,
    });
  }

  private createSpecFilters(): SpecFilter[] {
    const filters: SpecFilter[] = [];

    for (const [code, values] of this.pendingMultiSelectFilters()) {
      if (values.size > 0) {
        filters.push({ code, type: 'in', values: [...values] });
      }
    }

    for (const [code, value] of this.pendingSingleSelectFilters()) {
      filters.push({ code, type: 'eq', value });
    }

    for (const [code, range] of this.pendingRangeFilters()) {
      const min = Number(range.min);
      const max = Number(range.max);
      const filter: SpecFilter = { code, type: 'range' };

      if (range.min && Number.isFinite(min)) {
        filter.min = min;
      }

      if (range.max && Number.isFinite(max)) {
        filter.max = max;
      }

      if (filter.min !== undefined || filter.max !== undefined) {
        filters.push(filter);
      }
    }

    return filters;
  }

  private toCatalogSort(value: string): CatalogSort | undefined {
    return SORT_OPTIONS.some((option) => option.value === value) ? (value as CatalogSort) : undefined;
  }

  private normalizeRangeSelection(range: RangeSelection): RangeSelection {
    const min = Number(range.min);
    const max = Number(range.max);

    if (!range.min || !range.max || !Number.isFinite(min) || !Number.isFinite(max) || min <= max) {
      return range;
    }

    return {
      min: range.max,
      max: range.min,
    };
  }
}
