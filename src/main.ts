import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { Buyer } from "./components/Models/Buyer";
import { Catalog } from "./components/Models/Catalog";
import { CommunicationLayer } from "./components/Models/CommunicationLayer ";
import { ShopCart } from "./components/Models/ShopCart";
import {
  CardBasket,
  CardCatalog,
  CardPreview,
} from "./components/Views/CardView";
import { BasketView } from "./components/Views/CartViews";
import { ContactsFormView, OrderFormView } from "./components/Views/FormsView";
import { Gallery } from "./components/Views/GalleryView";
import { Header } from "./components/Views/HeaderView";
import { Modal } from "./components/Views/ModalView";
import { SuccessView } from "./components/Views/Success";
import "./scss/styles.scss";
import { IOrderRequest, IOrderResponse, IProduct, TPayment } from "./types";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";
import { cloneTemplate, ensureElement } from "./utils/utils";

const catalog = new Catalog();
const cart = new ShopCart();
const buyer = new Buyer();

//Проверяем класс коммуникаций
//Получение товаров (Get)
const api = new Api(API_URL);
const apiLarek = new CommunicationLayer(api);

const events = new EventEmitter();

const header = new Header(events, ensureElement<HTMLElement>(".header"));
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const basket = new BasketView(events, cloneTemplate<HTMLDivElement>("#basket"));
const formOrders = new OrderFormView(
  events,
  cloneTemplate<HTMLFormElement>("#order"),
);
const formContacts = new ContactsFormView(
  events,
  cloneTemplate<HTMLFormElement>("#contacts"),
);
const success = new SuccessView(
  events,
  cloneTemplate<HTMLDivElement>("#success"),
);
const cardPreview = new CardPreview(
  events,
  cloneTemplate<HTMLDivElement>("#card-preview"),
  {
    onToggleCart: () => events.emit("card:toggle-cart"),
  },
);

const renderCatalog = () => {
  const products = catalog.getProducts();
  const items = products.map((product) => {
    const card = new CardCatalog(
      events,
      cloneTemplate<HTMLButtonElement>("#card-catalog"),
      {
        onClick: () => events.emit("card:select", { product }),
      },
    );
    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
    });
  });
  gallery.render({ items });
};

const renderBasket = () => {
  const itemsInCart = cart.getProducts();
  const basketItems = itemsInCart.map((product, index) => {
    const item = new CardBasket(
      events,
      cloneTemplate<HTMLLIElement>("#card-basket"),
      {
        onDelete: () => events.emit("basket:item-remove", { id: product.id }),
      },
    );
    return item.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  return basket.render({
    items: basketItems,
    total: cart.getTotalProductsPrice(),
    empty: itemsInCart.length === 0,
  });
};

const renderPreview = () => {
  const selectedId = catalog.getSelectedProducts()?.id;
  if (!selectedId) {
    return;
  }
  const product = catalog.getProductsById(selectedId);
  if (!product) {
    return;
  }

  const inCart = cart.hasProduct(product.id);
  cardPreview.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    inCart,
  });
  modal.open(cardPreview.render());
};

const headerCounter = () => {
  header.render({ counter: cart.totalProducts() });
};

events.on("cart:change", () => {
  console.log("Cart changed, current products:", cart.getProducts());
  headerCounter();
  renderBasket();
});

events.on<{ product: IProduct }>("card:select", ({ product }) => {
  catalog.saveSelectedProducts(product);
  renderPreview();
});

events.on("card:toggle-cart", () => {
  const selected = catalog.getSelectedProducts();

  const selectedId = selected?.id;
  if (!selectedId) {
    return;
  }

  const product = catalog.getProductsById(selectedId);

  if (!product) {
    return;
  }

  const inCart = cart.hasProduct(selectedId);

  if (inCart) {
    cart.removeProduct(product);
  } else {
    cart.addProduct(product);
  }

  headerCounter();
  renderBasket();
  renderPreview();
});

events.on("basket:open", () => {
  modal.open(basket.render());
});

events.on<{ id: string }>("basket:item-remove", ({ id }) => {
  const productInCart = cart.getProducts().find((p) => p.id === id);

  if (!productInCart) {
    return;
  }

  cart.removeProduct(productInCart);

  headerCounter();
  renderBasket();
});

events.on("basket:order", () => {
  const data = buyer.getBuyerInfo();
  formOrders.render({
    valid: false,
    errors: "",
    payment: data.payment,
    address: data.address ?? "",
  });
  modal.open(formOrders.render());
});

events.on<{ payment: TPayment }>("order:payment-change", ({ payment }) => {
  buyer.saveBuyerInfo({ payment });
  events.emit("customer:order-change", {});
});

events.on<{ address: string }>("order:address-change", ({ address }) => {
  buyer.saveBuyerInfo({ address });
  events.emit("customer:order-change", {});
});

events.on("customer:order-change", () => {
  const data = buyer.getBuyerInfo();
  const fullValidation = buyer.validateInfo();
  
  // Игнорируем email/phone для формы заказа
  const orderErrors = {
    address: fullValidation.errors.address,
    payment: fullValidation.errors.payment
  };
  
  const errorsString = Object.values(orderErrors)
    .filter(Boolean)  // убираем undefined
    .join(", ") || "";
    
  const isValid = !orderErrors.address && !orderErrors.payment;  // только эти поля
  
  formOrders.render({
    valid: isValid,
    errors: errorsString,
    payment: data.payment,
    address: data.address ?? "",
  });
});

events.on("order:submit", () => {
  const data = buyer.getBuyerInfo();
  formContacts.render({
    valid: false,
    errors: "",
    email: data.email ?? "",
    phone: data.phone ?? "",
  });
  modal.open(formContacts.render());
});

events.on<{ email: string }>("contacts:email-change", ({ email }) => {
  buyer.saveBuyerInfo({ email });
  events.emit("customer:contacts-change", {});
});

events.on<{ phone: string }>("contacts:phone-change", ({ phone }) => {
  buyer.saveBuyerInfo({ phone });
  events.emit("customer:contacts-change", {});
});

events.on("customer:contacts-change", () => {
  const data = buyer.getBuyerInfo();
  const fullValidation = buyer.validateInfo();
  
  // Игнорируем address/payment для формы контактов
  const contactErrors = {
    email: fullValidation.errors.email,
    phone: fullValidation.errors.phone
  };
  
  const errorsString = Object.values(contactErrors)
    .filter(Boolean)
    .join(", ") || "";
    
  const isValid = !contactErrors.email && !contactErrors.phone;
  
  formContacts.render({
    valid: isValid,
    errors: errorsString,
    email: data.email ?? "",
    phone: data.phone ?? "",
  });
});

events.on("contacts:submit", async () => {
  const fullValidation = buyer.validateInfo();
  
  // ✅ Проверяем ТОЛЬКО email + phone
  const contactErrors = {
    email: fullValidation.errors.email,
    phone: fullValidation.errors.phone
  };
  
  if (Object.keys(contactErrors).some(key => contactErrors[key as keyof typeof contactErrors])) {
    // Есть ошибки контактов
    const errorsString = Object.values(contactErrors).filter(Boolean).join(", ") || "";
    formContacts.render({
      valid: false,
      errors: errorsString,
      email: buyer.getBuyerInfo().email ?? "",
      phone: buyer.getBuyerInfo().phone ?? "",
    });
    return;
  }

  const products = cart.getProducts();
  const buyerData = buyer.getBuyerInfo();
  const order: IOrderRequest = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: cart.getTotalProductsPrice(),
    items: products.map((product) => product.id),
  };

  try {
    const response = await apiLarek.createOrder(order);
    success.render({ total: response.total });
    modal.open(success.render());
    cart.cleanCart();
  } catch (error) {
    console.error("Ошибка при отправке заказа", error);
  }
});

events.on("success:close", () => {
  modal.close();
});

const runApp = async () => {
  header.render({ counter: 0 });
  try {
    const data: IProduct[] = await apiLarek.GetProd();
    catalog.saveProducts(data);
    renderCatalog();
  } catch (error) {
    console.error("Не удалось загрузить каталог", error);
  }
};

runApp();
