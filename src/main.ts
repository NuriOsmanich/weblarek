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

const events = new EventEmitter();

const catalog = new Catalog(events);
const cart = new ShopCart(events);
const buyer = new Buyer(events);

//Проверяем класс коммуникаций
//Получение товаров (Get)
const api = new Api(API_URL);
const apiLarek = new CommunicationLayer(api);

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

  const items = itemsInCart.map((product, index) => {
    const item = new CardBasket(
      events,
      cloneTemplate<HTMLLIElement>("#card-basket"),
      {
        onDelete: () =>
          events.emit("basket:item-remove", { id: product.id }),
      },
    );

    return item.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  return basket.render({
    items,
    total: cart.getTotalProductsPrice(),
    empty: itemsInCart.length === 0,
  });
};

const renderPreview = () => {
  const product = catalog.getSelectedProducts();
  if (!product) return;

  const inCart = cart.hasProduct(product.id);

  const preview = cardPreview.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    inCart,
  });

  modal.open(preview);
};

const headerCounter = () => {
  header.render({ counter: cart.totalProducts() });
};

events.on("cart:change", () => {
  headerCounter();
  renderBasket();
});

events.on<{ product: IProduct }>("card:select", ({ product }) => {
  catalog.saveSelectedProducts(product);
});

events.on("catalog:selected-change", () => {
  renderPreview();
});

events.on("card:toggle-cart", () => {
  const selected = catalog.getSelectedProducts();
  if (!selected) return;

  const inCart = cart.hasProduct(selected.id);

  if (inCart) {
    cart.removeProduct(selected);
  } else {
    cart.addProduct(selected);
  }

  modal.close();
});

events.on("basket:open", () => {
  modal.open(basket.render());
});

events.on<{ id: string }>("basket:item-remove", ({ id }) => {
  const productInCart = catalog.getProductsById(id);

  if (!productInCart) {
    return;
  }

  cart.removeProduct(productInCart);
});

events.on("basket:order", () => {
  if (cart.getProducts().length === 0) {
    return;
  }

  const data = buyer.getBuyerInfo();
  const errors = buyer.validateInfo().errors;

  const view = formOrders.render({
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || "",
    payment: data.payment,
    address: data.address ?? "",
  });

  modal.open(view);
});

events.on<{ payment: TPayment }>("order:payment-change", ({ payment }) => {
  buyer.saveBuyerInfo({ payment });
});

events.on<{ address: string }>("order:address-change", ({ address }) => {
  buyer.saveBuyerInfo({ address });
});

events.on('customer:change', () => {
  const errors = buyer.validateInfo().errors;
  const data = buyer.getBuyerInfo();
  formOrders.render({
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || '',
    payment: data.payment,
    address: data.address ?? '',
  });
});

events.on('order:submit', () => {
  const data = buyer.getBuyerInfo();
  const errors = buyer.validateInfo().errors;

  const view = formContacts.render({
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || '',
    email: data.email ?? '',
    phone: data.phone ?? '',
  });

  modal.open(view);
});


events.on<{ email: string }>("contacts:email-change", ({ email }) => {
  buyer.saveBuyerInfo({ email });
});

events.on<{ phone: string }>("contacts:phone-change", ({ phone }) => {
  buyer.saveBuyerInfo({ phone });
});

events.on('customer:change', () => {
  const errors = buyer.validateInfo().errors;
  const data = buyer.getBuyerInfo();
  formContacts.render({
    valid: !errors.phone && !errors.email,
    errors: errors.phone || errors.email || '',
    email: data.email ?? '',
    phone: data.phone ?? '',
  });
});

events.on('contacts:submit', async () => {
  const errors = buyer.validateInfo().errors;
  if (errors.phone || errors.email) {
    formContacts.render({
      valid: false,
      errors: errors.phone || errors.email || '',
      email: buyer.getBuyerInfo().email ?? '',
      phone: buyer.getBuyerInfo().phone ?? '',
    });
    return;
  }

  const products = cart.getProducts();
  const customerData = buyer.getBuyerInfo();
  const order: IOrderRequest = {
    payment: customerData.payment,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    total: cart.getTotalProductsPrice(),
    items: products.map((product) => product.id),
  };

  try {
    const response = await apiLarek.createOrder(order);
    success.render({ total: response.total });
    modal.open(success.render());
    cart.cleanCart();
    buyer.clearInfo();
  } catch (error) {
    console.error('Ошибка при отправке заказа', error);
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
  