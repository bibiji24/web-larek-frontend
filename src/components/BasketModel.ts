import { IProduct } from "../types";
import { EventEmitter } from "./base/events";

export class BasketModel implements BasketModel{
  protected _basket: Map<string, number> | null;
  protected _basketPrice: number;
  protected _itemsNumber: number| null; 

  constructor(protected events: EventEmitter) {
    this._basketPrice = 0;
    this._itemsNumber = null;
    this._basket = new Map<string, number>();
  }

  get basket() {
    return this._basket;
  }

  protected set basketPrice(newPrice) {
    this._basketPrice = newPrice
  }

  get basketPrice():number {
    if (this.basket.keys()) {
      let tempPrice = 0
      for (let i of this._basket.values()) {
        tempPrice += i;
      }
      this.basketPrice = tempPrice;
      return this._basketPrice;
    } else {
      this.basketPrice = 0;
      return this._basketPrice;
    }
  }

  get itemsNumber() {
    return this._itemsNumber;
  }

  protected set itemsNumber(number: number) {
    this._itemsNumber = number;
  }

  addToBasket(data: Pick<IProduct, 'id' | 'price'>):void {
    const { id, price } = data;
    if (!this.isInBasket(id)) {
      this.basket.set(id, price);
      this.itemsNumber = this.basket.size;
      this.events.emit(`model:basket:change`);
    } else {
      throw new Error(`Couldn't add item ${id} into BasketModel`);
    }
    
  }

  removeFromBasket(id: string) {
    if (this.isInBasket(id)) {
      this.basket.delete(id);
      this.itemsNumber = this.basket.size;
      this.events.emit(`model:basket:change`);
    } else {
      throw new Error(`Couldn't remove item ${id} from BasketModel`);
    }
  }

  clearBasket() {
    this._basketPrice = 0;
    this._itemsNumber = null;
    this._basket.clear();
    this.itemsNumber = this.basket.size;
    this.events.emit(`model:basket:change`);
  }

  isInBasket(id: string) {
    return this.basket.has(id);
  }
}