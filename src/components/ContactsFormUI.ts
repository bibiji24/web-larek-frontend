import { ValidationErrors } from "../types";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { FormUI } from "./FormUI";

export class ContactsFormUI extends FormUI {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter){
    super(container, events);
    this.emailInput = container.elements[0] as HTMLInputElement;
    this.phoneInput = container.elements[1] as HTMLInputElement;
    container.addEventListener('input', (evt) => {
      this.onInputChange({
        email: this.emailInput.value,
        phone: this.phoneInput.value
      })
    });

    this.submitButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      events.emit(`ui:contactsForm:submit`);
    });
  }

  onInputChange(data: {email: string, phone: string}){
    this.events.emit(`ui:contactsForm:inputChange`, data);
  }

  setValidationErrors(errors: ValidationErrors) {
    this.error.textContent = '';
    if (errors.email) {
      this.error.textContent = errors.email;
    }
    if (errors.phone) {
      this.error.textContent += `\n` + errors.phone;
    }
  }

}