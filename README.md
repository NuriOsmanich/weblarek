# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Данные

Интерфейсы:
`IProduct`:
export interface IProduct {
id: string;
title: string;
image: string;
category: string;
description: string;
price: number | null;
}

Интерфейс `IProduct`: Этот интерфейс создан для описание товаров нашего магазина. Он содержит в себе `Id` товара, его название `title`, описание `description`,категорию товара `category`, изображение `image`, стоимость `price`.

`IBuyer`:
export interface IBuyer {
address: string | null;
payment: TPayment | null;
email: string | null;
phone: string | null;
}

Интерфейс `IBuyer`: Этот интерфейс создан для описания покупателя. Он содержит в себе адрес покупателя `address`, способ, которым будет оплачена покупка `payment`, адрес электронной почты `email` и контактный номер телефона `phone`.

##### Модели данных

Класс `Catalog`
Класс, который содержит в себе данные о товаре в нашем магазине.

Конструктор класса не принимает параметров.

Поля класса:
`private product: IProduct[] = [];` - хранит массив товаров магазина.
` private selectedProduct: IProduct | null = null;` - хранит в себе выбранную карточку товара.

Методы класса:
`getProducts(): IProduct[]` - метод позволяет получить список товаров.
`getProductsById(productId:string): IProduct | undefined` - метод позволяет получить единственный товар по его Id
`saveSelectedProducts(product: IProduct): void` - метод позволяет сохранить выбранный продукт
`getSelectedProducts(): IProduct | null` - метод позволяет получить продукт, который мы выбрали
`saveProducts(product: IProduct[])` - метод позволяет сохранить массив товаров.

Класс `ShopCart`
Класс, который содержит в себе информацию о корзине покупок и создан для управления данными в ней.

Поля класса:
`private cartProduct: IProduct[] = [];` - поле класса содержит в себе массив товаров, которые находятся в корзине.

Конструктор класса не принимает параметров.

Методы класса:
`getProducts(): IProduct[]` - метод позволяет получить список товаров.
`addProduct(prod: IProduct)` - метод позволяет добавлять товары.
`removeProduct(product: IProduct): void` - метод позволяет удалять товары по Id
`totalProducts():number` - метод позволяет получить общее количество товаров в корзине.
`getTotalProductsPrice():number | null` - метод позволяет получить общую стоимость товаров в корзине.
`hasProduct(productId: string)` - метод проверяет наличие товаров.
`cleanCart(): void` - метод для полной очистки корзины.

Класс `Buyer`
Класс для хранения данных о покупателе.

Поля класса:
Объект `buyerInfo` который содержит в себе поля:
`address` - поле хранит в себе адрес объекта.
`payment` - поле хранит в себе варианты оплаты.
`email` - поле хранит в себе адрес электронной почты.
`phone` - поле хранит в себе контактный номер телефона.

Конструктор класса не принимает параметров.

Интерфейс `IBuyerInfoValidation` - интерфейс, созданный внутри модели для проверки данных на валидность.

Методы класса:
`saveBuyerInfo(info: Partial<IBuyer>): void` - метод позволяет сохранить данные покупателя.
`getBuyerInfo(): IBuyer` - метод позволяет получить все известные данные о покупателе.
`clearInfo(): void` - метод для очистки данных о покупателе.
`validateInfo(): { isValid: boolean; errors: IBuyerInfoValidation}` - метод для проверки данных о покупателе на валидность. Позволяет проверить указанные данные и , в случае ошибки, узнать в чем именно ошибся пользователь при вводе данных.

###### Слой коммуникации

Класс `CommunicationLayer`
Класс, который использует композицию для выполнения запроса к серверу с помощью метода get класса Api и получает с сервера объект с массивом товаров.

Методы класса:
`GetProd(): Promise<IProduct[]>` - Получает массив товаров с сервера и возвращает типизированный IProduct[]. Метод для получения товара с сервера

`async createOrder(buyer: IBuyer, cart: ShopCart): Promise<IOrderResponse> ` - метод для формирования заказа и отправки его на сервер с помощью `post`

###### Слой Представленя(View)

Класс `Header`

Используется для отображения логотипа и кнопки корзины с счетчиком количества товаров.

Поля класса:
`protected counterElement: HTMLElement` - элемент для отображения количества товаров в корзине.
`protected cartButton: HTMLButtonElement` - кнопка открытия корзины.

Конструктор:
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и корневой DOM‑элемент.

`Setters`:
`set counter(value: number)` - обновляет значение счётчика корзины.

Абстрактный класс `Card`

Общий класс представления для карточек товаров.

Поля класса:
`protected titleElement: HTMLElement` - DOM‑элемент заголовка карточки.
`protected priceElement: HTMLElement` - DOM‑элемент цены товара.

Конструктор:
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и корневой DOM‑элемент карточки.

Методы:
`protected formatPrice(value: number | null): string` - метод для отображения цены в формате ("Бесценно" или "... синапсов").

`Setters`:
`set title(value: string)` - устанавливает текст заголовка.
`set price(value: number | null)` - устанавливает текст цены, используя formatPrice.

Класс `CardCatalog`
Представление карточки товара в каталоге.

Поля класса:
`protected imageElement: HTMLImageElement` - изображение товара.
`protected categoryElement: HTMLElement` - элемент категории.

Конструктор:
`constructor(events: IEvents, container: HTMLElement, actions?: ICardActions)` - принимает брокер событий, DOM‑элемент карточки и необязательный объект с обработчиками действий.

`Setters`:
`set title(value: string)` - устанавливает заголовок карточки.
`set price(value: number | null)` - устанавливает текст цены.
`set category(value: string)` - устанавливает текст категории.
`set image(value: string)` - устанавливает изображение через setImage.

Класс `CardPreview`
Представление карточки товара в превью.

Поля класса:
`protected imageElement: HTMLImageElement` - изображение товара.
`protected categoryElement: HTMLElement` - элемент категории.
`protected descriptionElement: HTMLElement`- описание товара.
`protected buttonElement: HTMLButtonElement` - кнопка добавления/удаления из корзины.

Конструктор:
`constructor(events: IEvents, container: HTMLElement, actions?: ICardActions)` - принимает брокер событий, DOM‑элемент превью и необязательные обработчики действий.

`Setters`:
`set title(value: string)` - устанавливает заголовок.
`set description(value: string)` - устанавливает описание.
`set price(value: number | null)` - устанавливает значение цены и блокирует кнопку для товаров, которые не продаются.
`set category(value: string)` - устанавливает категорию.
`set image(value: string)` - устанавливает изображение товара.
`set inCart(value: boolean)` - обновляет текст кнопки в зависимости от того, находится ли товар в корзине.

Класс `CardBasket`
Представление  товара в корзине.

Поля класса:
`protected indexElement: HTMLElement` - порядковый номер товара в списке.
`protected deleteButton: HTMLButtonElement` - кнопка удаления товара из корзины.

Конструктор:
`constructor(events: IEvents, container: HTMLElement, actions?: ICardActions)` - принимает брокер событий, DOM‑элемент строки корзины и необязательный обработчик.


`Setters`:
`set index(value: number)` - устанавливает порядковый номер позиции.
`set title(value: string)` - устанавливает название товара.
`set price(value: number | null)` - устанавливает значение цены.

Класс `BasketView`
Представление корзины.

Поля класса:
`protected listElement: HTMLElement` - список товаров в корзине.
`protected totalElement: HTMLElement` - элемент для отображения итоговой суммы.
`protected submitButton: HTMLButtonElement` - кнопка перехода к оформлению.

Конструктор:
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и DOM‑элемент корзины.

`Setters`:
`set items(value: HTMLElement[])` - заменяет содержимое списка корзины.
`set total(value: number)` - обновляет отображение итоговой суммы.
`set empty(value: boolean)` - включает либо выключает кнопку оформления в зависимости от содержания корзины.


Класс `Modal`
Представление модального окна.

Поля класса:
`protected contentContainer: HTMLElement` - контейнер для содержимого модального окна.
`protected closeButton: HTMLButtonElement` - кнопка закрытия модального окна.

Конструктор:
`constructor(events: IEvents, container: HTMLElement)` - принимает брокер событий и корневой DOM‑элемент модального окна.



`Setters`:
`set content(value: HTMLElement | null)` - изменяет содержимое модального окна.


Абстрактный класс `FormView`
Общий класс для форм.

Поля класса:
`protected formElement: HTMLFormElement` - сама форма.
`protected submitButton: HTMLButtonElement` - кнопка отправки формы.
`protected errorsElement: HTMLElement` - контейнер для текстов ошибок.


Конструктор:
`constructor(events: IEvents, container: HTMLFormElement)` - принимает брокер событий и DOM‑элемент формы.


`Setters`:
`set valid(value: boolean)` - включает или выключает кнопку отправки.
`set errors(value: string)` - обновляет текст ошибок.

Методы:
`protected abstract onSubmit(): void` - абстрактный метод, который вызывается во время отправки формы. 

Класс `OrderFormView`
Представление формы выбора способа оплаты и адреса.

Поля класса:
`protected buttonCard: HTMLButtonElement` - кнопка выбора оплаты картой.
`protected buttonCash: HTMLButtonElement` - кнопка выбора оплаты наличными.
`protected addressInput: HTMLInputElement` - поле ввода адреса.

Конструктор:
`constructor(events: IEvents, container: HTMLFormElement)` - принимает брокер событий и DOM‑элемент формы.

`Setters`:
`set payment(value: string | null)` -  отмечает выбранный способ оплаты.
`set address(value: string)` - заполняет поле адреса.


Класс `ContactsFormView`
Представление формы с контактными данными.

Поля класса:
`protected emailInput: HTMLInputElement` - поле ввода email.
`protected phoneInput: HTMLInputElement` - поле ввода телефона.

Конструктор:
`constructor(events: IEvents, container: HTMLFormElement)` - принимает брокер событий и DOM‑элемент формы.

`Setters`:
`set email(value: string)` - заполняет поле email.
`set phone(value: string)` - заполняет поле телефона.


Класс `SuccessView`
Представление  успешного оформления заказа.

Поля класса:
`protected descriptionElement: HTMLElement` - текст с суммой списанных cредств. 
`protected closeButton: HTMLButtonElement` - кнопка закрытия окна.

Конструктор:
`constructor(events: IEvents, container: HTMLFormElement)` - принимает брокер событий и DOM‑элемент формы.

`Setters`:
`set total(value: number)` - устанавливает  "Списано x синапсов"  исходя из общей суммы.


Класс `GalleryView`
Представление галереи карточек товаров.

Конструктор:
`constructor(container: HTMLElement)` - принимает DOM-элемент каталога товаров.

`Setters`:
`set items(value: HTMLElement[])` - устанавливает содержимое галереии на основе переданного массива данных.

###### Презентер
Исходя из того, что сайт одностраничный, было принято решение реализовать код презентера непосредственно в `main.js`, не пребегая к созданию отдельного класса.