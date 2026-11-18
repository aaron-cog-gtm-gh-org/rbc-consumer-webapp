import { TestBed } from '@angular/core/testing';
import { Icon, IconName } from './icon';

const names: IconName[] = [
  'statements',
  'messages',
  'ebills',
  'offers',
  'beyond',
  'print',
  'search',
];

describe('Icon', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Icon] }).compileComponents();
  });

  const render = async (name: IconName) => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', name);
    await fixture.whenStable();
    return { fixture, svg: (fixture.nativeElement as HTMLElement).querySelector('svg')! };
  };

  it('should create', async () => {
    const { fixture } = await render('search');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a decorative svg', async () => {
    const { svg } = await render('search');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it.each(names)('renders shapes for the %s icon', async (name) => {
    const { svg } = await render(name);
    expect(svg.querySelectorAll('path, circle').length).toBeGreaterThan(0);
  });

  it('renders different markup for each icon name', async () => {
    const markup = await Promise.all(names.map(async (name) => (await render(name)).svg.innerHTML));
    expect(new Set(markup).size).toBe(names.length);
  });

  it('updates the shapes when the name input changes', async () => {
    const { fixture, svg } = await render('search');
    expect(svg.querySelector('circle[r="6.5"]')).not.toBeNull();
    fixture.componentRef.setInput('name', 'print');
    await fixture.whenStable();
    expect(svg.querySelector('circle')).toBeNull();
    expect(svg.querySelector('path[d="M7 9V4h10v5"]')).not.toBeNull();
  });
});
