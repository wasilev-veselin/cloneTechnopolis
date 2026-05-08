import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@techstore/design-system';
import { DeliveryMethodSelectorComponent } from '../../components/delivery-method-selector/delivery-method-selector.component';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { ShippingFormComponent } from '../../components/shipping-form/shipping-form.component';

@Component({
  selector: 'app-shipping-page',
  imports: [
    ButtonComponent,
    DeliveryMethodSelectorComponent,
    OrderSummaryComponent,
    RouterLink,
    ShippingFormComponent,
  ],
  templateUrl: './shipping-page.component.html',
  styleUrl: './shipping-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingPageComponent {}
