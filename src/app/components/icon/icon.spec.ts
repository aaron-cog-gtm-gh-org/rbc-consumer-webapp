import { TestBed } from '@angular/core/testing';
import { Icon, IconName } from './icon';

describe('Icon', () => {
  const render = async (name: IconName) => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', name);
    await fixture.whenStable();
    return fixture;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Icon] }).compileComponents();
  });

  it('should create', async () => {
    const fixture = await render('search');

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a decorative svg for the requested icon', async () => {
    const fixture = await render('search');
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;

    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelector('circle')).not.toBeNull();
  });

  it('renders a distinct shape per icon name', async () => {
    const names: IconName[] = [
      'statements',
      'messages',
      'ebills',
      'offers',
      'beyond',
      'print',
      'search',
    ];

    for (const name of names) {
      const fixture = await render(name);

      expect((fixture.nativeElement as HTMLElement).querySelector('svg')!.children.length).toBe(2);
    }
  });
});
