import { IProduct } from "../../types";
import { IEvents } from "../base/Events";


export class Catalog {
   private product: IProduct[] = [];
   private selectedProduct: IProduct|null = null;

   constructor(private readonly events?: IEvents){}

   //для получения списка товаров 
   getProducts(): IProduct[]{
    return [...this.product];
   }
   
   //для получения одного товара по id
   getProductsById(productId:string): IProduct | undefined{
      const product = this.product.find((product) => product.id === productId);
      return product;
   }

   //для сохранения карточки
   saveSelectedProducts(product: IProduct): void{
    this.selectedProduct = {...product};
    this.events?.emit('catalog:change')
   }

   //для добавления карточки
   getSelectedProducts(): IProduct | null{
    return this.selectedProduct;
   }

   //для сохранения массива товаров
   saveProducts(product: IProduct[]){
     this.product = [...product];
     this.events?.emit('catalog:change')
   }
}