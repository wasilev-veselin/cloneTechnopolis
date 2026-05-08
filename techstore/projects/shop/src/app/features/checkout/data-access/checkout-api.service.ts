import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { CartItem } from '../../cart/models/cart-item.model';
import type { DeliveryAddress } from '../models/delivery-address.model';
import type { OrderConfirmation } from '../models/order-confirmation.model';
import type { PaymentMethod } from '../models/payment-method.model';

export interface SubmitOrderRequest {
  cartItems: CartItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutApiService {
  private readonly httpClient = inject(HttpClient);

  submitOrder(request: SubmitOrderRequest): Observable<OrderConfirmation> {
    return this.httpClient.post<OrderConfirmation>(
      '/api/checkout/orders',
      request,
    );
  }
}
