import { IApi, IApiSmallHelp, IOrderRequest, IOrderResponse, IProduct } from "../../types";



export class CommunicationLayer {
  constructor(private api: IApi){}

  async GetProd(): Promise<IProduct[]>{
    const resp = await this.api.get<IApiSmallHelp>('/product/');
    return resp.items;
  }

  
  
   async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', orderData);
  
   }
}