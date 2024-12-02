import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/BasketModel';
import { ConsumerModel } from './components/ConsumerModel';
import { ProductsModel } from './components/ProductsModel';
import './scss/styles.scss';
import { IProduct, PaymentMethod, TConsumerAddressAndPayment, TConsumerContacts } from './types';
import { API_URL } from './utils/constants';
import { getObjectProperties } from './utils/utils';
// базовые классы
const api = new Api(API_URL);
const events = new EventEmitter();

// модели данных
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const consumerModel = new ConsumerModel(events);

// Получаем товары с сервера и помещаем их в модель данных
api.get('/product').then((data: {items: IProduct[]}) => {
  productsModel.productList = data.items
});

// Далее привязка слушателей к событиям
events.on(`model:products:change`, () => {
  
});

events.on(`model:products:previewChange`, () => {
    
});

events.on(`model:basket:change`, () => {
  
});

const addressData: TConsumerAddressAndPayment = {
  payment: PaymentMethod.offline,
  address: 'ergerg'
}

const contactsData: TConsumerContacts = {
  email: 'ergerg',
  phone: ''
}

consumerModel.addConsumerAddress(addressData);
consumerModel.addConsumerContacts(contactsData);

events.on('model:consumer:errorsChange', () => {
  console.log('event submitted');
  
});
console.log(consumerModel.errors);