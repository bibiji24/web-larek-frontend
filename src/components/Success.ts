import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

export class SuccessUI extends Component {
  protected totalPrice: HTMLElement;
  protected orderSuccessbutton: HTMLButtonElement;
  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);
    this.totalPrice = ensureElement<HTMLElement>('.order-success__description', container);
    this.orderSuccessbutton = ensureElement<HTMLButtonElement>('.order-success__close', container);
    this.orderSuccessbutton.addEventListener('click', () => {
      events.emit(`ui:success:close`);
    });
  }

  setTotalPrice(price: number) {
    this.totalPrice.textContent = `Списано ${price} синапсов`
  }
}