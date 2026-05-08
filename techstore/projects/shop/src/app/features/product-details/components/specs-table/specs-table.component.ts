import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ProductSpec } from '../../models/product-details.model';

@Component({
  selector: 'app-specs-table',
  imports: [],
  templateUrl: './specs-table.component.html',
  styleUrl: './specs-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecsTableComponent {
  readonly specs = input.required<readonly ProductSpec[]>();
}
