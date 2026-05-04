import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader{
  counter: Number
}

export class Header extends Component<IHeader>{
  protected counterElement: HTMLElement;
  protected cartButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.cartButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.cartButton.addEventListener('click', () => {
      this.events.emit('basket:open')
    });
  }

  set counter(value: number){
    this.counterElement.textContent = String(value);
  }

}