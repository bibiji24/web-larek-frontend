import { EventEmitter } from "./events";

export abstract class Component {
  protected constructor(protected readonly container: HTMLElement, protected events: EventEmitter) {
  }
  // возвращает DOM-элемент
  render(): HTMLElement {
    
    return this.container;
}
}