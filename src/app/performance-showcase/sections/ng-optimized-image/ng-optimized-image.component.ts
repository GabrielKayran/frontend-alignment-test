import { Component } from '@angular/core';
import { NgOptimizedImage, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

interface DemoImage {
  id: number;
  alt: string;
  priority: boolean;
}

@Component({
  selector: 'app-section-ng-optimized-image',
  standalone: true,
  imports: [NgOptimizedImage, TranslatePipe],
  // Passthrough loader: lets NgOptimizedImage work with absolute URLs in this isolated demo
  providers: [{ provide: IMAGE_LOADER, useValue: (c: ImageLoaderConfig) => c.src }],
  templateUrl: './ng-optimized-image.component.html',
  styleUrl: './ng-optimized-image.component.scss',
})
export class NgOptimizedImageComponent {
  protected readonly images: DemoImage[] = [
    { id: 10,  alt: 'Nature landscape',     priority: true  },
    { id: 20,  alt: 'City architecture',    priority: false },
    { id: 30,  alt: 'Abstract technology',  priority: false },
  ];

  protected imageUrl(id: number): string {
    return `https://picsum.photos/id/${id}/480/300`;
  }

  readonly codeAnti = `<span class="cm">// Plain img — no lazy loading, no size hints, hurts LCP</span>
<span class="tag">&lt;img</span> <span class="attr">src</span>=<span class="str">"/hero.jpg"</span>
     <span class="attr">alt</span>=<span class="str">"Hero banner"</span><span class="tag">&gt;</span>

<span class="cm">// Browser fetches immediately (no priority control),</span>
<span class="cm">// no dimensions → layout shift (CLS).</span>`;

  readonly codeBest = `<span class="cm">// NgOptimizedImage — lazy, sized, priority-aware</span>
<span class="tag">&lt;img</span> <span class="attr">ngSrc</span>=<span class="str">"/hero.jpg"</span>
     <span class="attr">width</span>=<span class="str">"800"</span> <span class="attr">height</span>=<span class="str">"600"</span>
     <span class="attr">priority</span><span class="tag">&gt;</span>

<span class="cm">// LCP images: fetchpriority="high" + preload link.</span>
<span class="cm">// Others: loading="lazy". width/height prevent CLS.</span>`;
}
