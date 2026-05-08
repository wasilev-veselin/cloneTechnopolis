import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import type { ProductImage } from '../../models/product-details.model';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  readonly images = input.required<readonly ProductImage[]>();
  protected readonly selectedIndex = signal(0);
  protected readonly selectedImage = computed(
    () => this.images()[this.selectedIndex()] ?? this.images()[0],
  );

  protected selectImage(index: number): void {
    this.selectedIndex.set(index);
  }
}
