import { Api } from './components/base/Api';
import { Buyer } from './components/base/Models/Buyer';
import { Catalog } from './components/base/Models/Catalog';
import { CommunicationLayer } from './components/base/Models/CommunicationLayer ';
import { ShopCart } from './components/base/Models/ShopCart';
import './scss/styles.scss';
import { IProduct, TPayment } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const catalog = new Catalog();
const cart = new ShopCart();
let buyer = new Buyer();

//Проверяем класс 'Catalog'
catalog.SaveProd(apiProducts.items);
console.log(`Массив товаров из каталога:`, catalog.GetProd());
const prodIdTrue = '854cef69-976d-4c2a-a18c-2aa45046c390';
console.log('Получаем товар по ID', catalog.GetProdById(prodIdTrue));
const testProd = catalog.GetProdById(prodIdTrue);
catalog.SaveSelProd(testProd!);
console.log('Выбранный товар', testProd);

//Проверяем класс 'ShopCart'
cart.AddProd(apiProducts.items);
console.log('Товары в корзине', cart.GetProd());
console.log('Общая стоимость товаров', cart.GetTotalProdPrice());
console.log('Количество товаров', cart.TotalProd());
const testID = '123123Aadsda';
cart.HasProd(testID);
cart.RemoveProd('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Количество товаров после удаления', cart.TotalProd());
cart.RemoveProd(testID);
console.log('Количество товаров после удаления по неверному ID -', cart.TotalProd());
cart.ShopCartCleaner();
console.log('Товары в корзине после удаления', cart.TotalProd());

//Проверяем класс 'Buyer'
buyer.SaveBuyerInfo({
  address: 'ул. Пушкина, дом Колотушкина',
  phone: '+7978',
  email: 'a@ya.ru',
  payment: TPayment.CARD
})
console.log('Инфо о покупателе', buyer.GetBuyerInfo());
const valid = buyer.ValidateInfo();
console.log(valid);
buyer.ClearInfo();
console.log(buyer);

//Проверяем класс коммуникаций 
//Получение товаров (Get)
const api = new Api(API_URL);
const apiS = new CommunicationLayer(api);

const products: IProduct[] = await apiS.GetProd()
console.log('Товары с сервера', products)
catalog.SaveProd(products);
console.log('Товары из модели', catalog.GetProd())

//Создание заказа (Post)
cart.AddProd([products[3], products[6]])
console.log('Товары в корзине!', cart.GetProd())
buyer.SaveBuyerInfo({
  address: 'ул. Пушкина, дом Колотушкина',
  phone: '+7978',
  email: 'a@ya.ru',
  payment: TPayment.CARD
})

const order = await apiS.createOrder(buyer.GetBuyerInfo(), cart)
console.log('Заказ создан',order)




