import { IApi, TPayment, IBuyer, IProduct } from "../../../types";
import { ShopCart } from "./ShopCart";

export interface IApiSmallHelp{
  items: IProduct[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export class CommunicationLayer {
  constructor(private api: IApi){}
  
  private mapPayment(pay: TPayment | null): string {
    return pay === TPayment.CARD?   'online' : 'offline';
  }

  async GetProd(): Promise<IProduct[]>{
    const resp = await this.api.get<IApiSmallHelp>('/product/');
    return resp.items;
  }

  
  
   async createOrder(buyer: IBuyer, cart: ShopCart): Promise<IOrderResponse> {
    
    const cartItems = cart.GetProd().map(product => product.id); 

    const total = cart.GetTotalProdPrice()

    const orderData = {
      payment: this.mapPayment(buyer.payment),
      email: buyer.email!,
      phone: buyer.phone!,
      address: buyer.address!,
      total: Number(total),
      items: cartItems  
    };
     return this.api.post<IOrderResponse>('/order/', orderData);
   }
}