import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";

export class ModalUI {
  protected container: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected modal: HTMLElement;
  protected onClose: () => void;

  constructor(modal:HTMLElement, protected events: EventEmitter){
    this.modal = modal;
    this.container = ensureElement('.modal__content', modal) as HTMLElement;
    this.closeButton = ensureElement('.modal__close', modal) as HTMLButtonElement;
    this.closeButton.addEventListener('click', () => {
      this.close();
    })
    this.modal.addEventListener('click', (evt) => {
      if (evt.target === this.modal) this.close();
    })
    
  }

  open(){
    this.modal.classList.add('modal_active')
    document.addEventListener('keydown', this.closeAtEsc);
  }

  close(){
    this.onClose();
    this.modal.classList.remove('modal_active')
    document.removeEventListener('keydown', this.closeAtEsc);
  }

  setContent(content: HTMLElement){
    this.container.replaceChildren(content);
  }

  protected closeAtEsc = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  setOnClose(fn: () => void) {
    this.onClose = fn;
  }
}