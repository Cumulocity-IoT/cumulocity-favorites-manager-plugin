import { Component, OnInit } from '@angular/core';
import { FavoritesManagerService } from './favorites-manager.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'c8y-favorites-action-component',
  templateUrl: 'favorites-action.component.html',
  providers: [FavoritesManagerService],
})
export class FavoritesActionComponent implements OnInit {
  private contextId: string;

  isFavorite: boolean;

  isFavoriteStateInitialized: boolean;

  constructor(
    private favoritesManagerService: FavoritesManagerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initContext();
    this.initFavoriteStatus();
  }

  toggleFavorite(): void {
    this.isFavorite
      ? this.favoritesManagerService.removeFromFavorites(this.contextId)
      : this.favoritesManagerService.addToFavorites(this.contextId);
    this.isFavorite = !this.isFavorite;
  }

  private initContext(): void {
    this.contextId = (
      (this.activatedRoute.snapshot.parent?.data ||
        this.activatedRoute.snapshot.firstChild?.data) as {
        contextData: { id: string };
      }
    ).contextData?.id;
  }

  private async initFavoriteStatus(): Promise<void> {
    if (!this.contextId) {
      throw new Error('Failed to initialize context');
    }

    this.isFavorite = await this.favoritesManagerService.getFavoriteStatus(this.contextId);
    this.isFavoriteStateInitialized = true;
  }
}
