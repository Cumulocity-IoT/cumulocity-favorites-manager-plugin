import { NgModule } from '@angular/core';

import { FavoritesManagerComponent } from './favorites-manager.component';
import { CoreModule, HOOK_ACTION_BAR, HOOK_NAVIGATOR_NODES, HOOK_ROUTE } from '@c8y/ngx-components';
import { FavoritesManagerNavigationFactory } from './favorites-manager.factory';
import { FavoritesActionComponent } from './favorites-action.component';
import { FavoritesActionFactory } from './favorites-action.factory';
import { StatusExtendedCellRendererComponent } from './columns/status-extended.cell-renderer.component';
import { ObjectTypeCellRendererComponent } from './columns/object-type.cell-renderer.component';

@NgModule({
  imports: [CoreModule],
  exports: [FavoritesManagerComponent, FavoritesActionComponent],
  declarations: [
    FavoritesManagerComponent,
    FavoritesActionComponent,
    ObjectTypeCellRendererComponent,
    StatusExtendedCellRendererComponent,
  ],
  entryComponents: [ObjectTypeCellRendererComponent, StatusExtendedCellRendererComponent],
  providers: [
    {
      provide: HOOK_NAVIGATOR_NODES,
      useClass: FavoritesManagerNavigationFactory,
      multi: true,
    },
    {
      provide: HOOK_ROUTE,
      useValue: {
        path: 'favorites',
        component: FavoritesManagerComponent,
      },
      multi: true,
    },
    {
      provide: HOOK_ACTION_BAR,
      useClass: FavoritesActionFactory,
      multi: true,
    },
  ],
})
export class FavoritesManagerModule {}
