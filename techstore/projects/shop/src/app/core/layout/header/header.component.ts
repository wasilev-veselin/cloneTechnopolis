import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../../features/cart/store/cart.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly cartStore = inject(CartStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected search(event: SubmitEvent, rawTerm: string): void {
    event.preventDefault();

    const term = rawTerm.trim();
    if (!term) {
      return;
    }

    const marketCode = this.route.snapshot.paramMap.get('marketCode') ?? 'bg';

    void this.router.navigate([marketCode, 'search'], {
      queryParams: { q: term },
    });
  }
}
