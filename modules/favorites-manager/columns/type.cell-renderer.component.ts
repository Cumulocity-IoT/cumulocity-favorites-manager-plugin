import { Component, OnInit } from '@angular/core';
import { CellRendererContext } from '@c8y/ngx-components';

@Component({
  template: `
    <span *ngIf="context.value" class="label label-info" [title]="context.value">{{
      context.value
    }}</span>
  `,
})
export class TypeCellRendererComponent {
  constructor(public context: CellRendererContext) {}
}
