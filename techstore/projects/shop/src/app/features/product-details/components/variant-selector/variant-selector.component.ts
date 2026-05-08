import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import type { ProductVariant } from '../../models/product-details.model';

@Component({
  selector: 'app-variant-selector',
  imports: [],
  templateUrl: './variant-selector.component.html',
  styleUrl: './variant-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantSelectorComponent {
  readonly variants = input.required<readonly ProductVariant[]>();
  readonly selectedSku = model<string | null>(null);

  protected selectVariant(sku: string): void {
    this.selectedSku.set(sku);
  }
}
