import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ShopCart{
  private cartProduct: IProduct[] = [];

  constructor(private readonly events?: IEvents){
    
  }

  private changesParam() {
        this.events?.emit('cart:change');
    }
  
  //для списка товаров
   getProducts(): IProduct[]{
    return [...this.cartProduct];
   }

   //для добавления товара
   addProduct(prod: IProduct){
    this.cartProduct.push(prod)
    this.changesParam();
   }

   //для удаления товара
   removeProduct(product: IProduct): void{
     const index = this.cartProduct.findIndex(prod => prod.id === product.id);
     if(index !== -1){
      this.cartProduct.splice(index, 1)
     } 
     this.changesParam();
   }

   //для получения кол-ва товаров
   totalProducts():number{
    return this.cartProduct.length;
   }
   //Сумма стоимости товаров
   getTotalProductsPrice():number | null{
    return this.cartProduct.reduce((sum, prod) => sum + prod.price!, 0)
   }
   //Для наличия товара
   hasProduct(productId: string){
    return this.cartProduct.some(prod => prod.id === productId);
   }

   //чистим корзину
   cleanCart(): void{
    this.cartProduct = [];
    this.changesParam();
   }
} 