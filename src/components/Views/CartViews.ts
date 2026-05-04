import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketView {
  items: HTMLElement[];
  total: number | null;
  empty: boolean;
}

export class BasketView extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.submitButton.addEventListener('click', () => {
      this.events.emit('basket:order', {});
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set empty(value: boolean) {
    this.submitButton.disabled = value;
  }
}