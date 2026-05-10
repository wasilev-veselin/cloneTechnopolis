import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, exhaustMap, pipe, tap } from 'rxjs';
import type { CartItem } from '../../cart/models/cart-item.model';
import { CartStore } from '../../cart/store/cart.store';
import { CheckoutApiService } from '../data-access/checkout-api.service';
import type { CheckoutStep } from '../models/checkout-step.model';
import type { DeliveryAddress } from '../models/delivery-address.model';
import type { OrderConfirmation } from '../models/order-confirmation.model';
import type { PaymentMethod } from '../models/payment-method.model';

type CheckoutState = {
  currentStep: CheckoutStep;
  deliveryAddress: DeliveryAddress | null;
  paymentMethod: PaymentMethod | null;
  orderConfirmation: OrderConfirmation | null;
  submitting: boolean;
  errorMessage: string | null;
};

const initialState: CheckoutState = {
  currentStep: 'shipping',
  deliveryAddress: null,
  paymentMethod: null,
  orderConfirmation: null,
  submitting: false,
  errorMessage: null,
};

export const CheckoutStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ deliveryAddress, paymentMethod }) => ({
    canContinueToPayment: computed(() => deliveryAddress() !== null),
    canSubmitOrder: computed(() => deliveryAddress() !== null && paymentMethod() !== null),
  })),
  withMethods((store) => {
    const checkoutApi = inject(CheckoutApiService);
    const cartStore = inject(CartStore);

    return {
      /** Задава активната стъпка на checkout flow-а. @param step – 'shipping' | 'payment' | 'confirmation' */
      setCurrentStep(step: CheckoutStep): void {
        patchState(store, { currentStep: step });
      },

      /** Записва адреса за доставка след валидиране на формата. @param address – попълнен DeliveryAddress обект */
      setDeliveryAddress(address: DeliveryAddress): void {
        patchState(store, { deliveryAddress: address });
      },

      /** Записва избрания начин на плащане. @param method – избран PaymentMethod от потребителя */
      setPaymentMethod(method: PaymentMethod): void {
        patchState(store, { paymentMethod: method });
      },

      /**
       * Изпраща поръчката към API-то. exhaustMap игнорира повторни извиквания докато заявката тече.
       * Чете deliveryAddress и paymentMethod директно от store-а; връща EMPTY ако липсват.
       * @param cartItems – артикули от CartStore, подадени от компонента
       */
      submitOrder: rxMethod<CartItem[]>(
        pipe(
          exhaustMap((cartItems) => {
            const deliveryAddress = store.deliveryAddress();
            const paymentMethod = store.paymentMethod();

            if (!deliveryAddress || !paymentMethod) {
              return EMPTY;
            }

            patchState(store, { submitting: true, errorMessage: null });

            return checkoutApi.submitOrder({ cartItems, deliveryAddress, paymentMethod }).pipe(
              tap((confirmation) => {
                cartStore.clear();
                patchState(store, {
                  orderConfirmation: confirmation,
                  currentStep: 'confirmation',
                  submitting: false,
                });
              }),
              catchError((err: unknown) => {
                patchState(store, {
                  errorMessage: err instanceof Error ? err.message : 'Грешка при изпращане на поръчката',
                  submitting: false,
                });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      /** Нулира целия checkout state до начални стойности (след успешна поръчка или изход). */
      reset(): void {
        patchState(store, initialState);
      },
    };
  }),
);
