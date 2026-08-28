import { Component, input } from '@angular/core';

export type IconName =
  'statements' | 'messages' | 'ebills' | 'offers' | 'beyond' | 'print' | 'search';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<IconName>();
}
