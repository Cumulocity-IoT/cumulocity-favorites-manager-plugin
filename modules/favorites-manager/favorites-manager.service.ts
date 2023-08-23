import { Injectable } from '@angular/core';
import { InventoryService, UserService } from '@c8y/ngx-components/api';
import { IUserCustomerProperties } from './favorites-manager.model';
import { IManagedObject } from '@c8y/client';

@Injectable()
export class FavoritesManagerService {
  constructor(private inventoryService: InventoryService, private userService: UserService) {}

  async getFavoredManagedObjects(): Promise<IManagedObject[]> {
    try {
      const managedObjectIds = await this.getFavoritesForCurrentUser();

      if (!managedObjectIds || managedObjectIds.length === 0) {
        return [];
      }

      const query = {
        __or: managedObjectIds.map((managedObjectId) => {
          return {
            __eq: {
              id: managedObjectId,
            },
          };
        }),
      };

      return (await this.inventoryService.listQuery(query, { pageSize: 2000 })).data;
    } catch (error) {
      console.error('Failed to load favored managed objects for current user: ', error);

      return [];
    }
  }

  private async getFavoritesForCurrentUser(): Promise<string[]> {
    try {
      const user = (await this.userService.current()).data;
      const customProperties = user.customProperties as IUserCustomerProperties;

      if (!customProperties || !customProperties.favorites) {
        return undefined;
      }

      return customProperties.favorites;
    } catch (error) {
      console.error('Failed to load favorites for current user: ', error);

      return undefined;
    }
  }
}
