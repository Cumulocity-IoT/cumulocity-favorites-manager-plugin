import { Component, OnInit } from '@angular/core';
import { FavoritesManagerService } from './favorites-manager.service';
import { IManagedObject } from '@c8y/client';
import { Column, Pagination } from '@c8y/ngx-components';

@Component({
  selector: 'c8y-favorites-manager',
  templateUrl: 'favorites-manager.component.html',
})
export class FavoritesManagerComponent implements OnInit {
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

  managedObjects: IManagedObject[] = [];

  constructor(private favoritesManagerService: FavoritesManagerService) {}

  async ngOnInit() {
    this.loadFavorites();
  }

  onReload() {
    this.loadFavorites();
  }

  private async loadFavorites(): Promise<void> {
    this.managedObjects = await this.favoritesManagerService.getFavoredManagedObjects();

    console.log('managed objects: ', this.managedObjects);
  }
}
