import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-shipping-form',
  imports: [],
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingFormComponent {}
