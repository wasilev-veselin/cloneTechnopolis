import { computed, Injectable, signal } from '@angular/core';
import type { CheckoutStep } from '../models/checkout-step.model';
import type { DeliveryAddress } from '../models/delivery-address.model';
import type { OrderConfirmation } from '../models/order-confirmation.model';
import type { PaymentMethod } from '../models/payment-method.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutStore {
  readonly currentStep = signal<CheckoutStep>('shipping');
  readonly deliveryAddress = signal<DeliveryAddress | null>(null);
  readonly paymentMethod = signal<PaymentMethod | null>(null);
  readonly orderConfirmation = signal<OrderConfirmation | null>(null);

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly canContinueToPayment = computed(
    () => this.deliveryAddress() !== null,
  );

  readonly canSubmitOrder = computed(
    () => this.deliveryAddress() !== null && this.paymentMethod() !== null,
  );

  setCurrentStep(step: CheckoutStep): void {
    this.currentStep.set(step);
  }

  setDeliveryAddress(deliveryAddress: DeliveryAddress): void {
    this.deliveryAddress.set(deliveryAddress);
  }

  setPaymentMethod(paymentMethod: PaymentMethod): void {
    this.paymentMethod.set(paymentMethod);
  }

  setSubmitting(submitting: boolean): void {
    this.submitting.set(submitting);
  }

  setErrorMessage(errorMessage: string | null): void {
    this.errorMessage.set(errorMessage);
  }

  setOrderConfirmation(orderConfirmation: OrderConfirmation): void {
    this.orderConfirmation.set(orderConfirmation);
  }

  reset(): void {
    this.currentStep.set('shipping');
    this.deliveryAddress.set(null);
    this.paymentMethod.set(null);
    this.orderConfirmation.set(null);
    this.submitting.set(false);
    this.errorMessage.set(null);
  }
}
