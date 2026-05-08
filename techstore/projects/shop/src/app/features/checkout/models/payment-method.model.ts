export interface PaymentMethod {
  id: string;
  label: string;
  type: 'card' | 'cashOnDelivery' | 'bankTransfer';
}
