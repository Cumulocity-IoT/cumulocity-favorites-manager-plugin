import { Injectable } from '@angular/core';
import { NavigatorNode, NavigatorNodeFactory, gettext } from '@c8y/ngx-components';

@Injectable()
export class FavoritesManagerNavigationFactory implements NavigatorNodeFactory {
  private readonly FAVORITES_LIST_NAVIGATOR_NODE = new NavigatorNode({
    label: gettext('Favorites'),
    path: '/favorites',
    icon: 'mark-as-favorite',
    priority: 5,
  });

  get() {
    return this.FAVORITES_LIST_NAVIGATOR_NODE;
  }
}
