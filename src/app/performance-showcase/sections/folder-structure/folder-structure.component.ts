import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-section-folder-structure',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './folder-structure.component.html',
  styleUrl: './folder-structure.component.scss',
})
export class FolderStructureComponent {
  readonly codeAnti = `<span class="cm">src/app/</span>
<span class="cm">├── components/</span>
<span class="cm">│   ├── header.component.ts</span>
<span class="cm">│   ├── user-card.component.ts</span>
<span class="cm">│   └── product-card.component.ts</span>
<span class="cm">├── services/</span>
<span class="cm">│   ├── auth.service.ts</span>
<span class="cm">│   └── cart.service.ts</span>
<span class="cm">└── pipes/</span>
<span class="cm">    └── format-price.pipe.ts</span>`;

  readonly codeBest = `<span class="cm">src/app/</span>
<span class="cm">├── feature/</span>
<span class="cm">│   ├── auth/</span>
<span class="cm">│   │   ├── auth.service.ts</span>
<span class="cm">│   │   └── login.component.ts</span>
<span class="cm">│   └── cart/</span>
<span class="cm">│       ├── cart.service.ts</span>
<span class="cm">│       └── cart.component.ts</span>
<span class="cm">└── shared/</span>
<span class="cm">    └── format-price.pipe.ts</span>`;
}
