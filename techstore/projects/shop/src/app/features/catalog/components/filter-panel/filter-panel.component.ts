import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';

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

  readonly brandsApplied = output<readonly string[]>();

  protected readonly pendingBrands = linkedSignal({
    source: () => this.selectedBrands(),
    computation: (selectedBrands) => new Set(selectedBrands),
  });
  protected readonly hasPendingSelection = computed(() => this.pendingBrands().size > 0);

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

  protected applyFilters(): void {
    this.brandsApplied.emit([...this.pendingBrands()]);
  }

  protected clearFilters(): void {
    this.pendingBrands.set(new Set());
    this.brandsApplied.emit([]);
  }
}
