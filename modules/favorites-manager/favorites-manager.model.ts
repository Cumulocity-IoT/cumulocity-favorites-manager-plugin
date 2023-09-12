import { IManagedObject } from '@c8y/client';

export interface IUserCustomerProperties {
  favorites?: string[];
}
export interface IManagedObjectExtended extends IManagedObject {
  c8y_IsDevice?: object;
  c8y_IsAsset?: object;
  c8y_IsDeviceGroup?: object;
}
