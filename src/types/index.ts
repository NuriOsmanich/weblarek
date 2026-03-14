export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export enum TPayment {
  CARD = 'card',
  CASH = 'cash'
}

export type ApiObj = object;

export interface IApi {
    get<T extends ApiObj>(uri: string): Promise<T>;
    post<T extends ApiObj>(uri: string, data: ApiObj, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
   id: string;
   title: string;
   image: string;
   category: string;
   description: string;
   price: number | null;
}

export interface IBuyer {
    address: string | null;
    payment: TPayment | null;
    email: string | null;
    phone: string | null;
}