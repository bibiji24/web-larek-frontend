import { IProduct } from "../types";
import { EventEmitter } from "./base/events";

export class ProductsModel {
  protected _productList: IProduct[];
  protected _preview: string | null;

  constructor(protected events: EventEmitter){
    this.preview = null;
  }

  set productList(data: IProduct[]) {
    this._productList = data;
    this.events.emit('model:products:change');
  }

  get productList() {
    return this._productList;
  }

  set preview(id: string) {
    this._preview = id;
    this.events.emit('model:products:previewChange');
  }

  get preview() {
    return this._preview;
  }

  getProduct(id: string): IProduct {
    const product = this._productList.find(item => item.id === id);
    if (product) {
      return product;
    }
    throw new Error(`Couldn't find product ${id}`);
  }
}