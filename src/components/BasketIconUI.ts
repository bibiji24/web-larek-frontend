import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

export class BasketIconUI {
  protected counter: HTMLSpanElement;

  constructor(container: HTMLButtonElement, protected events: EventEmitter){
    this.counter = ensureElement('.header__basket-counter', container);
    container.addEventListener('click', () => {
      events.emit(`ui:basketIcon:click`);
    });
  }

  setCounterValue(number: number){
    this.counter.textContent = String(number);
  }

}