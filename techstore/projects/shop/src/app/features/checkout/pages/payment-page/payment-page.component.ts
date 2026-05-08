import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@techstore/design-system';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { PaymentMethodSelectorComponent } from '../../components/payment-method-selector/payment-method-selector.component';

@Component({
  selector: 'app-payment-page',
  imports: [
    ButtonComponent,
    OrderSummaryComponent,
    PaymentMethodSelectorComponent,
    RouterLink,
  ],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPageComponent {}
