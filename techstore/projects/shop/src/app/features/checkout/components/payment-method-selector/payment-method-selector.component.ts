import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payment-method-selector',
  imports: [],
  templateUrl: './payment-method-selector.component.html',
  styleUrl: './payment-method-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodSelectorComponent {}
