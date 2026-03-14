import { IProduct } from "../../../types";


export class Catalog {
   private product: IProduct[] = [];
   private selectedProduct: IProduct|null = null;

   constructor(){}

   //для получения списка товаров 
   GetProd(): IProduct[]{
    return [...this.product];
   }
   
   //для получения одного товара по id
   GetProdById(productId:string): IProduct | undefined{
      const product = this.product.find((product) => product.id === productId);
      return product;
   }

   //для сохранения карточки
   SaveSelProd(product: IProduct): void{
    this.selectedProduct = {...product};
   }

   //для добавления карточки
   GetSelProd(): IProduct | null{
    return this.selectedProduct;
   }

   //для сохранения массива товаров
   SaveProd(product: IProduct[]){
     this.product = [...product];
   }
}