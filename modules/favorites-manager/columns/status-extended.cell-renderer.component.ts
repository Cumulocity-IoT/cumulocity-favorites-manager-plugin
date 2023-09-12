import { Component } from '@angular/core';
import { CellRendererContext } from '@c8y/ngx-components';

@Component({
  template: `
    <device-status *ngIf="context.item.c8y_IsDevice" [mo]="context.item"></device-status>
  `,
})
export class StatusExtendedCellRendererComponent {
  constructor(public context: CellRendererContext) {}
}
