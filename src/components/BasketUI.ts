import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

export class BasketUI extends Component {
  protected basketbutton: HTMLButtonElement;
  protected basketPrice: HTMLSpanElement;
  protected basketContainer: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter){
    super(container, events);
    this.basketbutton = ensureElement<HTMLButtonElement>('.basket__button', container);
    this.basketbutton.disabled = true;
    this.basketbutton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit(`ui:basket:order`);
    })

    this.basketPrice = ensureElement<HTMLSpanElement>('.basket__price', container);
    this.basketContainer = ensureElement<HTMLElement>('.basket__list', container);
  }

  setBasketItems(items: HTMLElement[]){
    this.basketContainer.replaceChildren(...items);
  }

  setTotalPrice(price: number) {
    this.basketPrice.textContent = price + ' синапсов';
  }

  disableOrderButton(status: boolean) {    
    if (!status) {
      this.basketbutton.setAttribute('disabled', 'disabled');
    } else {
      this.basketbutton.removeAttribute('disabled');
    }
  }
}