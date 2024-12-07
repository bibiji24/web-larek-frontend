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
    this.validate();
  }

  addConsumerContacts(data: TConsumerContacts){
    this._consumerInfo = {...this._consumerInfo, ...data};
    this.validate();
  }

  protected validate(){
    const errors: typeof this.errors = {};
    if (!this.consumerInfo.payment){
      errors.payment = 'Необходимо указать способ оплаты.';
    }
    if (!this.consumerInfo.address){
      errors.address = 'Необходимо указать адрес доставки.'
    }
    if (!this.consumerInfo.email){
      errors.email = 'Необходимо указать электронную почту.';
    }
    if (!this.consumerInfo.phone){
      errors.phone = 'Необходимо указать контактный номер телефона.'
    }
    this._errors = errors;    
  }

  addressIsValid(){
    return !(Boolean(this.errors.address) || Boolean(this.errors.payment))
  };

  contactIsValid(){
    return !(Boolean(this.errors.email) || Boolean(this.errors.phone))
  }

  clearData() {
    this._consumerInfo = {};
    this._errors = {};
  }
}