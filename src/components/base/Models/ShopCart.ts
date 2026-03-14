import { IProduct } from "../../../types";

export class ShopCart{
  private cartProduct: IProduct[] = [];

  constructor(){
    
  }
  
  //для списка товаров
   GetProd(): IProduct[]{
    return this.cartProduct;
   }

   //для добавления товара
   AddProd(prod: IProduct[]){
    this.cartProduct.push(...prod)
   }

   //для удаления товара
   RemoveProd(prodId: string): boolean{
     const index = this.cartProduct.findIndex(prod => prod.id === prodId);
     if(index === -1){
      return false;
     }
     this.cartProduct.splice(index, 1)
     return true;
   }

   //для получения кол-ва товаров
   TotalProd():number{
    return this.cartProduct.length;
   }
   //Сумма стоимости товаров
   GetTotalProdPrice():number | null{
    return this.cartProduct.reduce((sum, prod) => sum + prod.price!, 0)
   }
   //Для наличия товара
   HasProd(productId: string): boolean{
     const hasProd = this.cartProduct.some(prod => prod.id === productId);
     if(!hasProd){
      console.log('Товар с таким ID не найден')
     }
     return hasProd;
   }

   //чистим корзину
   ShopCartCleaner(): void{
    this.cartProduct = [];
   }
} 