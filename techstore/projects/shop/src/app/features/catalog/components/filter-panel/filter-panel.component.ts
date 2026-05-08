import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  imports: [],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent {
  readonly brands = input.required<readonly string[]>();
}
