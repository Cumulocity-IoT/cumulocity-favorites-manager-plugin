import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionBarFactory, ActionBarItem } from '@c8y/ngx-components';
import { FavoritesActionComponent } from './favorites-action.component';

@Injectable()
export class FavoritesActionFactory implements ActionBarFactory {
  private readonly FAVORITES_ACTION: ActionBarItem = {
    priority: 100,
    placement: 'left',
    template: FavoritesActionComponent,
  };

  constructor() {}

  async get(activatedRoute?: ActivatedRoute) {
    console.log('call get');

    if (!activatedRoute || !activatedRoute.parent) {
      return [];
    }

    console.log('activatedRoute: ', activatedRoute);

    // return this.FAVORITES_ACTION;
    return undefined;
  }
}
