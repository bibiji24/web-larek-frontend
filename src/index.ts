import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/BasketModel';
import { ProductsModel } from './components/ProductsModel';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL } from './utils/constants';
// базовые классы
const api = new Api(API_URL);
const events = new EventEmitter();

// модели данных
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);

// Получаем товары с сервера и помещаем их в модель данных
api.get('/product').then((data: {items: IProduct[]}) => {
  productsModel.productList = data.items
});

// Далее привязка слушателей к событиям
events.on(`model:products:change`, () => {
  console.log(productsModel.productList);
  let p = productsModel.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390');
  console.log('взят товар ');
  console.log(p);
  productsModel.preview = '854cef69-976d-4c2a-a18c-2aa45046c390';
  basketModel.addToBasket(p);
  basketModel.addToBasket(productsModel.getProduct('b06cde61-912f-4663-9751-09956c0eed67'))
  basketModel.addToBasket(productsModel.getProduct('412bcf81-7e75-4e70-bdb9-d3c73c9803b7'))
  console.log(basketModel.basket);
});

events.on(`model:products:previewChange`, () => {
  console.log(productsModel.preview);
  let p = productsModel.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390');
  
  console.log(p);
  
});

events.on(`model:basket:change`, () => {
  console.log('количество товаров в корзине');
  console.log(basketModel.itemsNumber);
  console.log('стоимость товаров в корзине');
  console.log(basketModel.basketPrice);
  if (basketModel.isInBasket('854cef69-976d-4c2a-a18c-2aa45046c390')) {
    basketModel.removeFromBasket('854cef69-976d-4c2a-a18c-2aa45046c390');
  }
});