import { EventEmitter } from "../components/base/events";

export enum ProductCategory {
  soft = 'софт-скил',
  hard = 'хард-скил',
  other = 'другое',
  additional = 'дополнительное',
  button = 'кнопка'
}

export interface IProduct {
  id: string;
  description:  string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number;
}

export enum PaymentMethod {
  online = 'Онлайн',
  offline = 'При получении'
}

export interface IConsumerInfo {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}

export type TConsumerAddressAndPayment = Pick<IConsumerInfo, 'address' | 'payment'>;
export type TConsumerContacts = Pick<IConsumerInfo, 'email' | 'phone'>;

export type ValidationErrors = Partial<Record<keyof IConsumerInfo, string>>;

export interface ProductModel {
  events: EventEmitter;
  productList: IProduct[];
  preview: string | null;
  getProduct(id: string): IProduct;
}

export interface BasketModel {
  events: EventEmitter;
  basket: Map<string, number>;
  basketPrice: number;
  addToBasket(id: string): void;
  removeFromBasket(id: string): void;
}

export interface ConsumerModel {
  events: EventEmitter;
  consumerInfo: IConsumerInfo;
  errors: ValidationErrors;
  addConsumerAddress(data: TConsumerAddressAndPayment): void;
  addConsumerContacts(data: TConsumerContacts): void;
  clearData(): void
}