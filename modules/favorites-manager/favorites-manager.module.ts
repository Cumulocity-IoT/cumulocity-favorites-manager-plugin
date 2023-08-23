import { NgModule } from '@angular/core';

import { FavoritesManagerComponent } from './favorites-manager.component';
import { CoreModule, HOOK_NAVIGATOR_NODES, HOOK_ROUTE } from '@c8y/ngx-components';
import { FavoritesManagerNavigationFactory } from './favorites-manager.factory';
import { FavoritesManagerService } from './favorites-manager.service';

@NgModule({
  imports: [CoreModule],
  exports: [FavoritesManagerComponent],
  declarations: [FavoritesManagerComponent],
  providers: [
    FavoritesManagerService,
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
  ],
})
export class FavoritesManagerModule {}
