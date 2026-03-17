import { Api } from './components/base/Api';
import { Buyer } from './components/Models/Buyer';
import { Catalog } from './components/Models/Catalog';
import { CommunicationLayer } from './components/Models/CommunicationLayer ';
import { ShopCart } from './components/Models/ShopCart';
import './scss/styles.scss';
import { IOrderRequest, IProduct, TPayment } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const catalog = new Catalog();
const cart = new ShopCart();
const buyer = new Buyer();

//Проверяем класс 'Catalog'
catalog.saveProducts(apiProducts.items);
console.log(`Массив товаров из каталога:`, catalog.getProducts());
const prodIdTrue = '854cef69-976d-4c2a-a18c-2aa45046c390';
console.log('Получаем товар по ID', catalog.getProductsById(prodIdTrue));
const testProd = catalog.getProductsById(prodIdTrue);
catalog.saveSelectedProducts(testProd!);
console.log('Выбранный товар', catalog.getSelectedProducts());

//Проверяем класс 'ShopCart'
const product1 = apiProducts.items[1];
const product2 = apiProducts.items[3];
cart.addProduct(product1);
cart.addProduct(product2);
console.log('Товары в корзине', cart.getProducts());

console.log('Общая стоимость товаров', cart.getTotalProductsPrice());

console.log('Количество товаров', cart.totalProducts());

const testID = '123123Aadsda';

console.log('Наличие товара',cart.hasProduct(testID));

cart.removeProduct(product1);

console.log('Количество товаров после удаления', cart.totalProducts());

cart.cleanCart();
console.log('Товары в корзине после очистки', cart.totalProducts());

//Проверяем класс 'Buyer'
buyer.saveBuyerInfo({
  address: 'ул. Пушкина, дом Колотушкина',
  phone: '+7978',
  email: 'a@ya.ru',
  payment: TPayment.CARD
})
console.log('Инфо о покупателе', buyer.getBuyerInfo());
const valid = buyer.validateInfo();
console.log('Результат валидации', valid);
buyer.clearInfo();
console.log('Данные о покупателе, после очистки', buyer.getBuyerInfo());

//Проверяем класс коммуникаций 
//Получение товаров (Get)
const api = new Api(API_URL);
const apiLarek = new CommunicationLayer(api);

try
{const products: IProduct[] = await apiLarek.GetProd()
console.log('Товары с сервера', products)
catalog.saveProducts(products);
console.log('Товары из модели', catalog.getProducts())
cart.addProduct(products[6])
cart.addProduct(products[3])
cart.addProduct(products[1])
console.log('Товары в корзине!', cart.getProducts())}
catch(err){
 console.log(`Произошла ошибка ${err}`)
}

//Создание заказа (Post)
buyer.saveBuyerInfo({
  address: 'ул. Пушкина, дом Колотушкина',
  phone: '+7978',
  email: 'a@ya.ru',
  payment: TPayment.CARD
})


const payload: IOrderRequest = {
  ...buyer.getBuyerInfo(),
  total: cart.getTotalProductsPrice(),
  items: cart.getProducts().map(prod => prod.id),
}
try
{const order = await apiLarek.createOrder(payload)
console.log('Заказ создан',order)}
catch(err){
  console.log(`Ошибка в создании заказа ${err}`)
}




