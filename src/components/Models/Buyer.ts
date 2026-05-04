import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

interface IBuyerInfoValidation{
  address?: string;
  payment?: string;
  email?: string;
  phone?: string;
}

export class Buyer{
 private buyerInfo: IBuyer = {
    address: '',
    payment: null,
    email: '',
    phone: ''
  };
 
  constructor(private readonly events?: IEvents){

  }

  private changesParam() {
        this.events?.emit('customer:change', {
            data: this.getBuyerInfo(),
        });
    }

  //Сохраняем данные 
  saveBuyerInfo(info: Partial<IBuyer>): void{
    this.buyerInfo = {
      ...this.buyerInfo,
      ...info
    }
    this.changesParam();
  }

  //получаем все данные 
  getBuyerInfo(): IBuyer{
    return {...this.buyerInfo};
  }

  //Очистка данных 
    clearInfo(): void {
    this.buyerInfo = {
      address: '',
      payment: null,
      email: '',
      phone: ''
    };
    this.changesParam();
  }

  //Валидация
  validateInfo(): {
    isValid: boolean;
    errors: IBuyerInfoValidation
  } {
    const errors:IBuyerInfoValidation = {};
    
    //Адрес
    if(this.buyerInfo.address === null || this.buyerInfo.address.trim() === ''){
      errors.address = 'Не указан адрес';
    }
    //Оплата
    if(this.buyerInfo.payment === null){
      errors.payment = 'Надо выбрать вид оплаты'
    } else if(this.buyerInfo.payment !== 'card' && this.buyerInfo.payment !== 'cash'){
      errors.payment = 'Недопустимый вид оплаты';
    }
    //Email
    if(this.buyerInfo.email === null || this.buyerInfo.email.trim() === ''){
      errors.email = 'Почту нужно заполнить'
    }
    //Номер телефона
    if(this.buyerInfo.phone === null || this.buyerInfo.phone.trim() === ''){
      errors.phone = 'Номер телефона нужно заполнить'
    }

   const isValid = Object.keys(errors).length === 0;

  return {isValid, errors}
  }
}