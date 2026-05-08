import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-mini-cart',
  imports: [],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartComponent {
  protected readonly cartStore = inject(CartStore);
}
