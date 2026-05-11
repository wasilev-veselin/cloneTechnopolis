import { Injectable, signal } from '@angular/core';

export type ToastType = 'error';

export interface ToastMessage {
  readonly id: number;
  readonly message: string;
  readonly type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly toastMessages = signal<readonly ToastMessage[]>([]);

  readonly messages = this.toastMessages.asReadonly();

  showError(message: string): void {
    const toast: ToastMessage = {
      id: this.nextId,
      message,
      type: 'error',
    };

    this.nextId += 1;
    this.toastMessages.update((messages) => [...messages, toast]);
    globalThis.setTimeout(() => this.dismiss(toast.id), 5000);
  }

  dismiss(id: number): void {
    this.toastMessages.update((messages) => messages.filter((message) => message.id !== id));
  }
}
