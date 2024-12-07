import { IProduct, ProductCategory } from "../types";
import { CDN_URL, productCats } from "../utils/constants";
import { bem, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

export class CardUI extends Component {
  protected id: string;
  protected description:  HTMLParagraphElement | null;
  protected image: HTMLImageElement | null;
  protected title: HTMLHeadingElement;
  protected category: HTMLSpanElement | null;
  protected price: HTMLSpanElement;
  protected cardButton: HTMLButtonElement | null;
  protected indexInBasket: HTMLSpanElement | null;

  constructor(container: HTMLElement, events: EventEmitter){
    super(container, events);
    this.title = ensureElement<HTMLHeadingElement>('.card__title', container);
    this.price = ensureElement<HTMLSpanElement>('.card__price', container);
    this.description = null;
    this.image = null;
    this.category = null;
    this.cardButton = null;
    this.indexInBasket = null;
  }

  setForBasket(cardData: IProduct){
    this.indexInBasket = ensureElement<HTMLSpanElement>('.basket__item-index', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardButton.addEventListener('click', () => {
      this.events.emit('ui:basket:removeFromBusket', {id: this.id});
    });
    this.setMinimal(cardData);
  }

  setIndex(index: number){
    this.indexInBasket.textContent = String(index);
  }

  setForPreview(cardData: IProduct){
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    // проверка цены товара. Если товар бесценный, то его невозможно купить
    if (!cardData.price) {
      this.cardButton.textContent = 'Товар не продается'
      console.log(this.cardButton.textContent);
      
      this.cardButton.disabled = true;
    }

    // стандартный обработчик покупки
    this.cardButton.addEventListener('click', () => {
      this.events.emit('ui:card:buy', {id: this.id});
    });

    this.setImage(cardData.image, cardData.title);

    this.setCategory(cardData.category);

    this.description = ensureElement<HTMLParagraphElement>('.card__text', this.container);
    this.description.textContent = cardData.description;

    this.setMinimal(cardData);
  }

  setForCatalog(cardData: IProduct){
    this.setCategory(cardData.category);
    
    this.setImage(cardData.image, cardData.title);

    this.setMinimal(cardData);

    this.container.addEventListener('click', () => {
      this.events.emit(`ui:card:pick`, {id: this.id});
    })
  }

  protected setImage(src: string, title: string){
    this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.image.src = CDN_URL + src;
    
    this.image.alt = title;
  }

  protected setCategory(cat: ProductCategory){
    this.category = ensureElement<HTMLSpanElement>('.card__category', this.container);
    this.category.textContent = cat;
    this.category.classList.add('card__category_' + productCats.get(cat));
  }

  protected setMinimal(cardData: IProduct){
    this.id = cardData.id;
    this.title.textContent = cardData.title;
    const itemPrice = cardData.price === null? 0: cardData.price;
    this.price.textContent = itemPrice + ' синапсов';
  }
  // меняет поведение кнопки если товар есть в корзине и меняет надпись на ней.
  changeButtonState(inBasket: boolean){
    if (inBasket) {
      this.cardButton.textContent = 'Убрать из корзины'
      this.cardButton.addEventListener('click', () => {
        this.events.emit('ui:card:removeFromBusket', {id: this.id});
      });
    }
  }
}