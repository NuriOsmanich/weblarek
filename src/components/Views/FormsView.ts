import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IFormView {
  valid: boolean;
  errors: string;
}

export abstract class FormView<T extends IFormView> extends Component<T> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);
    this.formElement = container;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.formElement.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
      this.onSubmit();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  protected abstract onSubmit(): void;
}

interface IOrderFormView extends IFormView {
  payment: string | null;
  address: string;
}

export class OrderFormView extends FormView<IOrderFormView> {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.buttonCard.addEventListener('click', () => {
      this.events.emit('order:payment-change', { payment: 'card' });
    });

    this.buttonCash.addEventListener('click', () => {
      this.events.emit('order:payment-change', { payment: 'cash' });
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:address-change', { address: this.addressInput.value });
    });
  }

  set payment(value: string | null) {
    this.buttonCard.classList.toggle('button_alt-active', value === 'card');
    this.buttonCash.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  protected onSubmit(): void {
    this.events.emit('order:submit', {});
  }
}

interface IContactsFormView extends IFormView {
  email: string;
  phone: string;
}

export class ContactsFormView extends FormView<IContactsFormView> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:email-change', { email: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:phone-change', { phone: this.phoneInput.value });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  protected onSubmit(): void {
    this.events.emit('contacts:submit', {});
  }
}