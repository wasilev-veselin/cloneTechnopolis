import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ts-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
