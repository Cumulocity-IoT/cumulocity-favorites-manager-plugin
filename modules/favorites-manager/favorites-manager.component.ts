import { Component, OnInit } from '@angular/core';
import { FavoritesManagerService } from './favorites-manager.service';
import { IManagedObject } from '@c8y/client';
import { Column, Pagination } from '@c8y/ngx-components';
import { AlarmsDeviceGridColumn, NameDeviceGridColumn } from '@c8y/ngx-components/device-grid';

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
      gridTrackSize: '120px',
    },
    new NameDeviceGridColumn(),
    new AlarmsDeviceGridColumn(),
  ];

  managedObjects: IManagedObject[] = [];

  constructor(protected favoritesManagerService: FavoritesManagerService) {}

  async ngOnInit() {
    this.favoritesManagerService.initFavorites();
  }
}
