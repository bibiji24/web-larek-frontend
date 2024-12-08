import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { BasketIconUI } from './components/BasketIconUI';
import { BasketModel } from './components/BasketModel';
import { BasketUI } from './components/BasketUI';
import { CardUI } from './components/CardUI';
import { ConsumerModel } from './components/ConsumerModel';
import { ContactsFormUI } from './components/ContactsFormUI';
import { ModalUI } from './components/ModalUI';
import { OrderFormUI } from './components/OrderFormUI';
import { ProductsModel } from './components/ProductsModel';
import { SuccessUI } from './components/Success';
import './scss/styles.scss';
import { IOrder, IProduct, ISuccessOrderAnswer, PaymentMethod, TConsumerAddressAndPayment, TConsumerContacts } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement, getObjectProperties } from './utils/utils';

// дополнительные функции
const onModalClose = () => {
  pageWrapper.classList.remove('page__wrapper_locked');
}

const onModalOpen = () => {
  pageWrapper.classList.add('page__wrapper_locked');
}

// все темплейты
const successTemp = ensureElement('#success') as HTMLTemplateElement;
const cardTemp = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemp = ensureElement('#card-preview') as HTMLTemplateElement;
const cardBasketItemTemp = ensureElement('#card-basket') as HTMLTemplateElement;
const basketTemp = ensureElement('#basket') as HTMLTemplateElement;
const orderFormTemp = ensureElement('#order') as HTMLTemplateElement;
const contactsFormTemp = ensureElement('#contacts') as HTMLTemplateElement;

// все DOM-элементы
const pageWrapper = ensureElement('.page__wrapper') as HTMLElement;
const productList = ensureElement('.gallery') as HTMLElement;
const basketIconButton = ensureElement('.header__basket') as HTMLButtonElement;
const modalElement = ensureElement('.modal') as HTMLElement;
const orderFormElement = cloneTemplate(orderFormTemp) as HTMLFormElement;
const basketElement = cloneTemplate(basketTemp) as HTMLElement;
const contactsElement = cloneTemplate(contactsFormTemp) as HTMLFormElement;
const successElement = cloneTemplate(successTemp) as HTMLElement;
const cardPreviewElem = cloneTemplate(cardPreviewTemp) as HTMLElement;


// базовые классы
const api = new Api(API_URL);
const events = new EventEmitter();

// модели данных
const productsModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const consumerModel = new ConsumerModel(events);

// объекты
const basketIcon = new BasketIconUI(basketIconButton, events);
const modal = new ModalUI(modalElement, events);
const orderForm = new OrderFormUI(orderFormElement, events);
const contactsForm = new ContactsFormUI(contactsElement, events);
const basket = new BasketUI(basketElement, events);
const success = new SuccessUI(successElement, events);
const previewCard = new CardUI(cardPreviewElem, events);

modal.setOnClose(onModalClose);

// Получаем товары с сервера и помещаем их в модель данных
api.get('/product').then((data: {items: IProduct[]}) => {
  productsModel.productList = data.items
}).catch(err => {
  console.error(err);
});;

// Далее привязка слушателей к событиям

events.on(`model:products:change`, () => {
  const elems = productsModel.productList.map(item => {
    const cardElem = new CardUI(cloneTemplate<HTMLButtonElement>(cardTemp), events);
    cardElem.setForCatalog(item);
    return cardElem.render();
  })
  
  productList.replaceChildren(...elems)

});

events.on(`model:basket:change`, () => {
  // меняем счетчик на иконке корзины
  basketIcon.setCounterValue(basketModel.itemsNumber);

  // меняем состояние кнопки карточки превью
  previewCard.changeButtonState(basketModel.isInBasket(previewCard.id));
  
  // менем содержимое корзины
  const basketItems: HTMLElement[] = [];
  let index: number = 1;
  for (let item of basketModel.basket.keys()) {
    const cardData = productsModel.getProduct(item)
    const cardElem = new CardUI(cloneTemplate<HTMLButtonElement>(cardBasketItemTemp), events);
    cardElem.setForBasket(cardData);
    cardElem.setIndex(index);
    basketItems.push(cardElem.render());
    index += 1;
  }
  basket.setBasketItems(basketItems);
  basket.setTotalPrice(basketModel.basketPrice);

  if (basketModel.basketPrice === 0) {
    basket.disableOrderButton(false);
  } else {
    basket.disableOrderButton(true);
  }
});

events.on(`ui:card:pick`, ({ id }: {id: string}) => {
  const cardData = productsModel.getProduct(id);
  previewCard.setForPreview(cardData);
  previewCard.changeButtonState(basketModel.isInBasket(id));
  onModalOpen();
  modal.open();
  modal.setContent(previewCard.render());
});

events.on(`ui:card:buy`, ({ id }: {id: string}) => {
  basketModel.addToBasket(productsModel.getProduct(id));
});

events.on(`ui:basketIcon:click`, () => {
  modal.open();
  onModalOpen();
  modal.setContent(basket.render());
})

events.on('ui:basket:removeFromBasket', ({ id }: {id: string}) => {
  basketModel.removeFromBasket(id);
})

events.on(`ui:basket:order`, () => {
  modal.setContent(orderForm.render());
});

events.on(`ui:orderForm:inputChange`, (data: TConsumerAddressAndPayment) => {
  consumerModel.addConsumerAddress(data);
  orderForm.setValidationErrors(consumerModel.errors);
  orderForm.disableOrderButton(!consumerModel.addressIsValid());
});

events.on(`ui:orderForm:submit`, () => {
  modal.setContent(contactsForm.render());
});

events.on(`ui:contactsForm:inputChange`, (data: TConsumerContacts) => {
  consumerModel.addConsumerContacts(data);
  contactsForm.setValidationErrors(consumerModel.errors);  
  contactsForm.disableOrderButton(!consumerModel.contactIsValid());
});

events.on(`ui:contactsForm:submit`, () => {
  const order = {
    total: basketModel.basketPrice,
    items: Array.from(basketModel.basket.keys())
  }
  const data: IOrder = {...consumerModel.consumerInfo, ...order};
  api.post('/order', data).then((data: ISuccessOrderAnswer) => {
    success.setTotalPrice(data.total);
    consumerModel.clearData();
    orderForm.reset();
    contactsForm.reset();
    basketModel.clearBasket();
    modal.setContent(success.render());
  }).catch(err => {
    console.error(err);
  });
});

events.on(`ui:success:close`, () => {
  modal.close();
});