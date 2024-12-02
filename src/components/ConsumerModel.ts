import { IConsumerInfo, IConsumerModel, TConsumerAddressAndPayment, TConsumerContacts, ValidationErrors } from "../types";
import { EventEmitter } from "./base/events";

export class ConsumerModel implements IConsumerModel {
  protected _consumerInfo: Partial<IConsumerInfo>;
  protected _errors: ValidationErrors;

  constructor(protected events: EventEmitter){
    this._consumerInfo = {};
    this._errors = {};
  }

  get consumerInfo() {
    return this._consumerInfo;
  }

  get errors() {
    return this._errors;
  }

  addConsumerAddress(data: TConsumerAddressAndPayment){
    this._consumerInfo = {...data};
    this.validateAddress();
  }

  addConsumerContacts(data: TConsumerContacts){
    this._consumerInfo = {...this._consumerInfo, ...data};
    this.validateContacts();
  }

  protected validateAddress(){
    const errors: typeof this.errors = {};
    if (this.consumerInfo.payment === ''){
      errors.payment = 'Необходимо указать способ оплаты.';
    }
    if (this.consumerInfo.address === ''){
      errors.address = 'Необходимо указать адрес доставки.'
    }
    this._errors = {...this._errors, ...errors};
    this.events.emit('model:consumer:errorsChange');
    console.log('validate address');
    
  }

  protected validateContacts(){
    const errors: typeof this.errors = {};
    if (this.consumerInfo.email === ''){
      console.log('wrong email');
      
      errors.payment = 'Необходимо указать электронную почту.';
    }
    if (this.consumerInfo.phone === ''){
      errors.phone = 'Необходимо указать контактный номер телефона.'
    }
    this._errors = {...this._errors, ...errors};
    this.events.emit('model:consumer:errorsChange');
    console.log('validate contacts');

  }

  addressIsValid(){
    if (this.errors.address && this.errors.payment) {
      return true;
    } else {
      return false;
    }
  };

  contactIsValid(){
    if (this.errors.email && this.errors.phone) {
      return true;
    } else {
      return false;
    }
  }

  clearData() {
    this._consumerInfo = {};
    this._errors = {};
  }
}