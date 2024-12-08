import { PaymentMethod, ValidationErrors } from "../types";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { FormUI } from "./FormUI";

export class OrderFormUI extends FormUI {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected inputAddress: HTMLInputElement;
  protected paymentMethod: PaymentMethod | '';
  constructor(container: HTMLFormElement, events: EventEmitter){
    super(container, events);
    this.paymentMethod = '';
    this.inputAddress = ensureElement<HTMLInputElement>('input[name=address]', container);
    this.inputAddress.addEventListener('input', this.onInputChange);

    this.buttonCard = ensureElement<HTMLButtonElement>('button[name=card]', container);
    this.buttonCard.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.paymentMethod = PaymentMethod.online;
      this.switchButtons(this.buttonCard, this.buttonCash);
      this.onInputChange();
    });

    this.buttonCash = ensureElement<HTMLButtonElement>('button[name=cash]', container);
    this.buttonCash.addEventListener('click', (evt) => {
      evt.preventDefault();
      this.paymentMethod = PaymentMethod.offline;
      this.switchButtons(this.buttonCash, this.buttonCard);
      this.onInputChange();
    })

    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit(`ui:orderForm:submit`);
    });
  }

  protected onInputChange = () => {
    this.events.emit(`ui:orderForm:inputChange`, {
      payment: this.paymentMethod,
      address: this.inputAddress.value
    });
  }

  protected switchButtons(clickedButtonElem: HTMLButtonElement, buttonElem: HTMLButtonElement){
    if (!clickedButtonElem.classList.contains('button_alt-active')) {
      clickedButtonElem.classList.add('button_alt-active');
    }
    if (buttonElem.classList.contains('button_alt-active')) {
      buttonElem.classList.remove('button_alt-active');
    }
  }

  setValidationErrors(errors: ValidationErrors) {
    this.error.textContent = '';
    if (errors.payment) {
      this.error.textContent = errors.payment;
    }
    if (errors.address) {
      this.error.textContent += errors.address;
    }
  }

  reset(): void {
    this.container.reset()
    if (this.buttonCard.classList.contains('button_alt-active')) {
      this.buttonCard.classList.remove('button_alt-active');
    }
    if (this.buttonCash.classList.contains('button_alt-active')) {
      this.buttonCash.classList.remove('button_alt-active');
    }
  }

}