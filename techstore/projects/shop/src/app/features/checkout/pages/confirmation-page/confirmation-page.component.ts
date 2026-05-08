import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@techstore/design-system';

@Component({
  selector: 'app-confirmation-page',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPageComponent {}
