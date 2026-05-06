import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement | null;
}

export class Modal extends Component<IModal> {
  protected contentContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement | null) {
    this.contentContainer.replaceChildren();
    if (value) {
      this.contentContainer.append(value);
    }
  }

  open(content: HTMLElement) {
    this.content = content;
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentContainer.replaceChildren();
  }
}