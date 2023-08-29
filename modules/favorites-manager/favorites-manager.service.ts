import { Injectable } from '@angular/core';
import { InventoryService, UserService } from '@c8y/ngx-components/api';
import { IUserCustomerProperties } from './favorites-manager.model';
import { IManagedObject } from '@c8y/client';
import { isEmpty } from 'lodash';
import { Column, DataSourceModifier, Pagination, ServerSideDataResult } from '@c8y/ngx-components';
import { InventoryDatasourceService } from '../services/inventory-datasource.service';

@Injectable()
export class FavoritesManagerService {
  readonly PAGINATION: Pagination = {
    pageSize: 50,
    currentPage: 1,
  };

  readonly COLUMNS: Column[] = [
    {
      name: 'id',
      header: 'ID',
      path: 'id',
      sortable: true,
      gridTrackSize: '60px',
    },
    {
      name: 'name',
      path: 'name',
      header: 'Name',
      sortable: true,
      filterable: true,
    },
  ];

  private BASE_QUERY = {
    __or: [],
  };

  serverSideDataCallback: Promise<ServerSideDataResult>;

  constructor(
    private inventoryService: InventoryService,
    private userService: UserService,
    private inventoryDatasource: InventoryDatasourceService
  ) {}

  async initFavorites(): Promise<void> {
    const favorites = await this.getFavoritesForCurrentUser();

    if (!favorites || favorites.length === 0) {
      return;
    }

    this.BASE_QUERY.__or = favorites.map((favorite) => {
      return { __eq: { id: favorite } };
    });

    this.serverSideDataCallback = this.onDataSourceModifier.bind(this);
  }

  async onDataSourceModifier(
    dataSourceModifier: DataSourceModifier
  ): Promise<ServerSideDataResult> {
    console.log('on grid load');
    return this.inventoryDatasource.reload(dataSourceModifier, this.BASE_QUERY);
  }

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

  async getFavoriteStatus(managedObjectId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavoritesForCurrentUser();

      if (isEmpty(favorites)) {
        return false;
      }

      return favorites.findIndex((favorite) => favorite === managedObjectId) !== -1;
    } catch (error) {
      console.error('Failed to get favorite status: ', error);
    }
  }

  async addToFavorites(managedObjectId: string): Promise<void> {
    try {
      const user = (await this.userService.current()).data;
      const customProperties = user.customProperties as IUserCustomerProperties;

      customProperties.favorites
        ? customProperties.favorites.push(managedObjectId)
        : (customProperties.favorites = [managedObjectId]);

      this.userService.updateCurrent(user);
    } catch (error) {
      console.error('Failed to add object to favorites: ', error);
    }
  }

  async removeFromFavorites(managedObjectId: string): Promise<void> {
    try {
      const user = (await this.userService.current()).data;
      const customProperties = user.customProperties as IUserCustomerProperties;

      if (isEmpty(customProperties.favorites)) {
        return;
      }

      customProperties.favorites.splice(
        customProperties.favorites.findIndex((favoriteId) => favoriteId === managedObjectId)
      );

      this.userService.updateCurrent(user);
    } catch (error) {
      console.error('Failed to add object to favorites: ', error);
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
