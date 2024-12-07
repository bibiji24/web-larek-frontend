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
  price: number | null;
}

export enum PaymentMethod {
  online = 'online',
  offline = 'offline'
}

export interface IConsumerInfo {
  payment: PaymentMethod | '';
  address: string;
  email: string;
  phone: string;
}

export type TConsumerAddressAndPayment = Pick<IConsumerInfo, 'address' | 'payment'>;
export type TConsumerContacts = Pick<IConsumerInfo, 'email' | 'phone'>;

export type ValidationErrors = Partial<Record<keyof IConsumerInfo, string>>;

export interface IProductModel {
  productList: IProduct[];
  getProduct(id: string): IProduct;
}

export interface IBasketModel {
  basket: Map<string, number>;
  basketPrice: number | null;
  itemsNumber: number;
  addToBasket(data: Pick<IProduct, 'id' | 'price'>): void;
  removeFromBasket(id: string): void;
  clearBasket(): void
  isInBasket(id: string): boolean;
}

export interface IConsumerModel {
  consumerInfo: Partial<IConsumerInfo>;
  errors: ValidationErrors;
  addConsumerAddress(data: TConsumerAddressAndPayment): void;
  addConsumerContacts(data: TConsumerContacts): void;
  addressIsValid(): boolean;
  contactIsValid(): boolean;
  clearData(): void
}

export interface IOrder extends Partial<IConsumerInfo> {
  total: number;
  items: string[];
}

export interface ISuccessOrderAnswer {
  total: number;
  id: string;
}