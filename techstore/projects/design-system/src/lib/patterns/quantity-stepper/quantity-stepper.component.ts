import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'ts-quantity-stepper',
  imports: [],
  templateUrl: './quantity-stepper.component.html',
  styleUrl: './quantity-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityStepperComponent {
  readonly quantity = model(1);
  readonly min = input(1);
  readonly max = input(99);

  protected decrement(): void {
    this.quantity.update((value) => Math.max(this.min(), value - 1));
  }

  protected increment(): void {
    this.quantity.update((value) => Math.min(this.max(), value + 1));
  }
}
