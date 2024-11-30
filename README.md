# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных приложения

Данные товара
``` TypeScript
interface IProduct {
  id: string;
  description:  string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number;
}
```
Для категории товара используется `enum`
``` TypeScript
enum ProductCategory {
  soft = 'софт-скил',
  hard = 'хард-скил',
  other = 'другое',
  additional = 'дополнительное',
  button = 'кнопка'
}
```
`Enum` введен, чтобы упростить создание карточек товаров (доабвление декорированных тегов).

Данные покупателя

``` TypeScript
interface IConsumerInfo {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
}
```
Данные для форм оформления заказа
``` TypeScript
type TConsumerAddressAndPayment = Pick<IConsumerInfo, 'address' | 'payment'>;
type TConsumerContacts = Pick<IConsumerInfo, 'email' | 'phone'>;
```

Тип для хранения информации о валидности данных в модели.
``` TypeScript
type ValidationErrors = Partial<Record<keyof IConsumerInfo, string>>;
```

## Архитектура проекта

Архитектура приложения выстроена согласно подходам MVP.\
Компоненты приложения разделены на следующие слои:
- слой данных, отвечает за хранение и изменение данных
- слой представления, отвечает за отображение данных на странице,
- презентер, отвечает за связь представления и данных.\

Слой представления генерирует события черех брокер событий и это вызывает методы слоя данных. 
Также изменения данных в модели генерируют события, которые вызывают методы слоя отображения. 
Связка слушателей и событий, основная логика приложения находится в слое перзентера.\
В исходный код добавлен базовый класс Component, от которого наслудются все классы слоя отображения.

### Базовый код
#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   
- `onAll` - метод для подписки на все события
- `offAll` - метод для сброса всех обработчиков

#### Класс Component
Базовый класс для компонентов отображения. Конструктор принимает `protected container: HTMLElement`, который и будет потом выдаваться методом `render`. 
Также класс имеет метод render(): HTMLElement, который возвращает элемент для отображения на странице. 

### Слой данных
#### Класс ProductsModel
Класс отвеает за хранение данных о товарах и отвечает за их изменение и работу над ними.\
Изменение массива товаров генерирует событие `model:products:change`.
Конструктор класса принимает инстант брокера событий.
В полях класса хранятся следующие данные:
- events: EventEmitter - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- productList: IProduct[] - массив товаров, доступных в ларьке.
- preview: string | null - id товара, выбранной для просмотра в модальном окне. Изменение сеттером создает событие `model:products:prevewChange`.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- getProduct(id: string): IProduct - метод возвращает объект товара из `productList` по его уникальному `id`.
- сlearPreview(): void - метод очищает свойство `preview`. В частности вызывается при событии закрытия модального окна с карточкой товара.
- сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс BasketModel
Класс отвеает за хранение данных о содержимом корзинки и отвечает за изменение этих данных.\
Конструктор класса принимает инстант брокера событий. Любое изменение данных в массиве товаров в корзине генерирует событие `model:basket:change`.
В полях класса хранятся следующие данные:
- events: EventEmitter - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- basket: Map<string, number> - массив уникальных `id` товаров, добавленных в корзину.
- basketPrice: number - общая стоимость всех товаров, добавленных в корзину.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- addToBasket(id: string): void - добавляет выбранный в товар в `basket`.
- removeFromBasket(id: string): void - удаляет выбранный товар из массива `basket`.
- геттеры для получения данных из полей класса.

#### Класс ConsumerModel
Класс отвеает за хранение данных о покупателе и способе оплаты и отвечает за изменение этих данных.\
Конструктор класса принимает инстант брокера событий
В полях класса хранятся следующие данные:
- events: EventEmitter - экземпляр класса `EventEmitter` для инициации событий при изменении данных.
- consumerInfo: IConsumerInfo - информация покупателя, которая будет храниться в этом свойстве.
- errors: ValidationErrors - информация о валидности данных в модели.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- addConsumerAddress(data: TConsumerAddressAndPayment): void - добавляет данные в поле `address` свойства `consumerInfo`.
- addConsumerContacts(data: TConsumerContacts): void - добавляет данные в поля `email` и `phone` свойства `consumerInfo`.
- clearData(): void - метод для очистки данных о пользователе и методе оплаты.
- геттер для получения данных из полей класса.
- validate() - метод проверяет данные при каждом их изменении и меняет свойство `errors`. При изменении свойства `errors` генерируется событие model:consumer:errorsChange

### Слой отображения
#### Класс BasketIconUI
Класс реализует счетчик товаров на главной странице. Расширяет базовый класс `Component`. Нажатие на элемент генерирует событие `ui:basketIcon:click`.
- _counter: HTMLParagraphElement - элемент отображения счетчика корзина.

#### Класс ProdactListUI
Класс отображает список товаров на галвной странице. Расширяет базовый класс `Component`. 
- setContent(card: CardUI[])

#### Класс CardUI
Расширяет базовый класс `Component`. Отвечает за отображение карточки, задавая в карточке данные названия, изображения, описания, стоимости, категории. Имеет 3 вида отображения на странице: `card` (отображение на главной странице), `card_full` (отображение в модальном окне), `card_compact` (отображение в корзине). В зависисмости от переданного в конструктор DOM элемент соответствующего темплейта, формируются карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события. Нажатие на карточку `card` генерирует событие `ui:card:pick`.
Поля класса содержат элементы разметки элементов карточки и `isPicked` -  булево значение, определяющее добавлен ли уже товар в корзину. Конструктор, кроме темплейта принимает экземпляр EventEmitter для инициации событий.
Методы:
- setProduct(data: IProduct, isPicked: boolean): void - метод принимает данные товара и `isPicked` булево значение, определяющее находится ли товар в корзине. В зависимости от этого значения будет изменено отображение кнопки покупки на кнопку удаления из корзины.

#### Класс BasketUI
Расширяет базовый класс `Component`. Отвечает за отображение содержимого модального окна корзины. Кнопка оформления заказа может быть как активной так и неактивной.
Свойтсва:
- basketButton: HTMLButtonElement - элемент кнопки старта оформления заказа.
- basketPrice: HTMLElement - элемент для отображения полной суммы заказа.
- basketContainer: HTMLElement - элемент, который будет содержать карточки товаров в корзине.
- setBasketItems(items: HTMLElements[]): void - изменение списка товаров корзины.
- setTotalPrice(price: number): void - изменение полной стоимости заказа.
- disableOrderButton(status: boolean) - изменение состояния кнопки оформления заказа. 

#### Класс ModalUI
Класс отвечает за отображение модального окна. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
В модальное окно будет возможно добавлять любое содержимое.

- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса EventEmitter для возможности инициации событий.
- setContent(element: HTMLElement): void - метод, добавляющий содержимое модального окна.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий
- content: HTMLElement - элемент, в котором будет отображаться содержимое модального окна.

#### Класс FormUI
Расширяет базовый класс `Component`. Является родительским классом для всех форм проекта. Необходимо переропределить конструктор родительского класса, чтобы он принимает HTMLFormElement. 
Свойства:
- container: HTMLFormElement - переопределяем свойство родительского класса, так как данный класс описывает форму.
- error: HTMLElement - элемент для отображения ошибки при вводе пользователем данных.
- submitButton: HTMLButtonElement - свойство хранит элемент кнопки отправки данных из формы.
- _valid: boolean - от этого свойства зависит отображение валидности формы. Доступ к изменению через сеттер.

Методы:
- disableOrderButton(status: boolean) - изменение состояния кнопки оформления заказа. 

#### Класс ContactsFormUI
Расширяет класс `FormUI`. Предназначен для создания формы добавления данных покупателя при оформлении заказа. Хранит два поля ввода `emailElement` и `phoneElement`. Нажатие кнопки `submit` генерирует событие `ui:contactsForm:submit`.
Методы:
- submit(data: IConsumerContacts): void - метод инициирует событие `ui:contactsForm:submit`.
- onInputChange(): void - метод генерирует событие `ui:contactsForm:inputChange` при каждом изменение содержимого полей ввода и отправляет значения полей ввода.

#### Класс OrderFormUI
Расширяет класс `FormUI`. Предназначен для создания формы выбора способа оплаты и адреса доставки. 
Свойства:
- buttonPayCard: HTMLButtonElement - кнопка выбора метода оплаты картой.
- buttonPayCash: HTMLButtonElement - кнопка выбора метода оплаты наличными.
- inputAddress: HTMLInputElement - элемент поля ввода адреса
Методы:
- submit(data: IConsumerContacts): void - метод инициирует событие `ui:orderForm:submit`.
- onInputChange(): void - метод генерирует событие `ui:orderForm:inputChange` при каждом изменение содержимого полей ввода и отправляет данные формы.

##### Класс Success
Расширяет базовый класс `Component`. Класс отвечает за отображение содержимого модального окна с подтверждением оформления заказа. 
Свойства:
- totalPrice: HTMLElement - элемент для отображения полной суммы оформленного заказа.
- orderSuccessButton: HTMLButtonElement - кнопка закрытия модального окна для продолжения работы с магазином. Нажатие генерирует событие `ui:success:close`.

### Презентер
В проекте слой презентера отдельно не выделен. Вся основная логика проекта представлена в файле `index.ts`.
Взаимодействие выделенных слоев отображения и данных осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### *Список всех событий, которые могут генерироваться в системе:*
#### *События изменения данных (генерируются классами моделями данных)*
- `model:products:change` - изменение массива товаров.
- `model:basket:change` - изменение массива товаров в корзине.
- `model:products:prevewChange` - изменение открываемой в модальном окне товара.
- `model:consumer:errorsChange` - изменение валидности данных о пользователе в модели.

#### *События, генерируемые при действиях пользователя (генерируются классами отображения)*
- `ui:basketIcon:click` - событие нажатия на иконку корзинки на главной странице. Должен вызывать открытие модального окна с содержимым корзины.
- `ui:card:pick` - событие генериуется при нажатии карточки на главной странице. Должен вызывать изменение поля `preview` модели данных товаров, что в свою очередь вызывает открытие модального окна с карточкой товара.
- `ui:card:buy` - добвления товара в корзину.
- `ui:card:removeFromBusket` - событие генерируется при нажатии кнопки удаления товара из корзины из модального окна с карточкой товара. 
- `ui:modal:open` - генерируется при открытии модального окна.
- `ui:modal:close` - генерируется при закрытии модального окна.
- `ui:basket:order` - событие генерируется при нажатии кнопки оформление заказа в корзине.
- `ui:basket:removeFromBusket` - событие генерируется при нажатии кнопки удаления товара из корзины из модального окна с корзиной.
- `ui:contactsForm:submit` - событие генерируется при нажатии кнопки "Оплатить" в форме `ContactsForm`.
- `ui:contactsForm:inputChange` - событие генерируется при изменении полей ввода формы `ContactsForm`.
- `ui:orderForm:submit` - событие генерируется при нажатии кнопки "Далее" в форме `OrderForm`.
- `ui:orderForm:inputChange` - событие генерируется при изменении полей ввода формы `OrderForm`.
- `ui:success:close` - событие генерируется при нажатии кнопки "За новыми покупками!".