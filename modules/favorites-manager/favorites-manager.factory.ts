import { Injectable } from '@angular/core';
import { NavigatorNode, NavigatorNodeFactory, gettext } from '@c8y/ngx-components';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class FavoritesManagerNavigationFactory implements NavigatorNodeFactory {
  constructor(private translateService: TranslateService) {}

  private readonly FAVORITES_LIST_NAVIGATOR_NODE = new NavigatorNode({
    label: this.translateService.instant('favorites.title'),
    path: '/favorites',
    icon: 'mark-as-favorite',
    priority: 5,
  });

  get() {
    return this.FAVORITES_LIST_NAVIGATOR_NODE;
  }
}
