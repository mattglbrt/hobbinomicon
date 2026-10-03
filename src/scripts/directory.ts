/**
 * Client behaviour for GameDirectory.astro (filter, sort, count, URL state,
 * mobile drawer). See that component for what the markup promises.
 *
 * Loaded by BaseLayout, not by the component, and only on pages that have a
 * directory. Swup (BaseLayout) swaps pages without a reload, and a script
 * shipped by the component would arrive with the page it's needed on, after
 * that page's swup:page:view has already fired, so clicking into /games/
 * would leave the filters dead. Same reason Countdown and Comments keep their
 * handlers in BaseLayout.
 */
const FIRST = 48;
const STEP = 24;

function init(root: HTMLElement) {
  const keys = (root.dataset.facets || '').split(' ').filter(Boolean);
  const list = root.querySelector<HTMLElement>('[data-list]')!;
  const items = [...list.querySelectorAll<HTMLElement>('li[data-game]')];
  const tokens = new Map(items.map((li) => [li, new Set((li.dataset.game || '').split(' '))]));
  const boxes = [...root.querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
  const panel = root.querySelector<HTMLElement>('[data-panel]')!;
  const sort = root.querySelector<HTMLSelectElement>('[data-sort]')!;
  const shown = root.querySelector<HTMLElement>('[data-shown]')!;
  const shownBtn = root.querySelector<HTMLElement>('[data-shown-btn]')!;
  const of = root.querySelector<HTMLElement>('[data-of]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const loosen = root.querySelector<HTMLButtonElement>('[data-loosen]')!;
  const more = root.querySelector<HTMLButtonElement>('[data-more]')!;
  const chips = root.querySelector<HTMLElement>('[data-chips]')!;
  const openBtn = root.querySelector<HTMLButtonElement>('[data-open]')!;
  const activeN = root.querySelector<HTMLElement>('[data-active-n]')!;

  // Order filters were added in, so "drop the last one" means something.
  let order: string[] = [];
  let limit = FIRST;

  const selected = () => {
    const s = new Map<string, string[]>();
    for (const b of boxes) if (b.checked) s.set(b.name, [...(s.get(b.name) || []), b.value]);
    return s;
  };
  const matches = (li: HTMLElement, sel: Map<string, string[]>, skip?: string) => {
    const t = tokens.get(li)!;
    for (const [k, vals] of sel) if (k !== skip && !vals.some((v) => t.has(`${k}:${v}`))) return false;
    return true;
  };
  const labelOf = (b: HTMLInputElement) => b.closest('label')!.querySelector('span')!.textContent!.trim();

  function reorder() {
    const by = sort.value;
    const num = (li: HTMLElement, k: string) => Number(li.dataset[k] || 0);
    const sorted = [...items].sort((a, b) => {
      if (by === 'az') return a.dataset.title!.localeCompare(b.dataset.title!);
      if (by === 'newest') return num(b, 'added') - num(a, 'added');
      if (by === 'price') {
        const ca = a.dataset.cost === '' ? Infinity : num(a, 'cost');
        const cb = b.dataset.cost === '' ? Infinity : num(b, 'cost');
        return ca - cb || a.dataset.title!.localeCompare(b.dataset.title!);
      }
      return num(b, 'covered') - num(a, 'covered') || a.dataset.title!.localeCompare(b.dataset.title!);
    });
    list.append(...sorted);
  }

  function render() {
    const sel = selected();
    order = order.filter((id) => boxes.some((b) => b.checked && `${b.name}=${b.value}` === id));

    let n = 0;
    for (const li of list.children as HTMLCollectionOf<HTMLElement>) {
      const ok = matches(li, sel);
      if (ok) n++;
      li.hidden = !ok || n > limit;
    }

    for (const b of boxes) {
      const c = items.filter((li) => matches(li, sel, b.name) && tokens.get(li)!.has(`${b.name}:${b.value}`)).length;
      b.closest('label')!.querySelector<HTMLElement>('[data-count]')!.textContent = String(c);
      b.disabled = c === 0 && !b.checked;
    }

    shown.textContent = String(n);
    shownBtn.textContent = String(n);
    of.hidden = n === items.length;
    more.hidden = n <= limit;
    more.textContent = `Show ${Math.min(STEP, n - limit)} more`;
    empty.hidden = n > 0;
    if (n === 0 && order.length) {
      const [k, v] = order[order.length - 1].split('=');
      const b = boxes.find((x) => x.name === k && x.value === v)!;
      loosen.textContent = `Remove "${labelOf(b)}"`;
    }

    const active = boxes.filter((b) => b.checked);
    activeN.textContent = active.length ? ` (${active.length})` : '';
    chips.replaceChildren(
      ...active.map((b) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'min-h-9 px-3 rounded-full bg-ink/10 dark:bg-ink-dark/10 text-sm text-ink dark:text-ink-dark';
        chip.textContent = `${labelOf(b)} ×`;
        chip.setAttribute('aria-label', `Remove filter: ${labelOf(b)}`);
        chip.addEventListener('click', () => { b.checked = false; changed(); });
        return chip;
      }),
      ...(active.length > 1 ? [Object.assign(document.createElement('button'), {
        type: 'button',
        className: 'min-h-9 px-3 text-sm underline underline-offset-4 text-ink/70 dark:text-ink-dark/70',
        textContent: 'Clear all',
        onclick: () => { boxes.forEach((b) => (b.checked = false)); changed(); },
      })] : []),
    );
  }

  function writeUrl() {
    const params = new URLSearchParams();
    for (const [k, vals] of selected()) params.set(k, vals.join(','));
    if (sort.value !== 'recent') params.set('sort', sort.value);
    const q = params.toString().replace(/%2C/g, ',');
    history.replaceState(null, '', q ? `${location.pathname}?${q}` : location.pathname);
  }

  function changed() { limit = FIRST; render(); writeUrl(); }

  // Read state from the URL. Unknown keys and values are ignored, so an old
  // or hand-typed link degrades to "fewer filters", never to an error.
  const params = new URLSearchParams(location.search);
  for (const k of keys) {
    for (const v of (params.get(k) || '').split(',').filter(Boolean)) {
      const b = boxes.find((x) => x.name === k && x.value === v);
      if (b) { b.checked = true; order.push(`${k}=${v}`); }
    }
  }
  const s = params.get('sort');
  if (s && [...sort.options].some((o) => o.value === s)) sort.value = s;

  for (const b of boxes) {
    b.addEventListener('change', () => {
      const id = `${b.name}=${b.value}`;
      order = order.filter((x) => x !== id);
      if (b.checked) order.push(id);
      changed();
    });
  }
  sort.addEventListener('change', () => { reorder(); changed(); });
  more.addEventListener('click', () => { limit += STEP; render(); });
  loosen.addEventListener('click', () => {
    const [k, v] = order[order.length - 1].split('=');
    boxes.find((x) => x.name === k && x.value === v)!.checked = false;
    changed();
  });
  root.querySelector('[data-clear]')!.addEventListener('click', () => { boxes.forEach((b) => (b.checked = false)); changed(); });

  // Mobile drawer.
  const setOpen = (open: boolean) => {
    panel.classList.toggle('max-lg:hidden', !open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) panel.querySelector<HTMLElement>('[data-close]')?.focus();
    else openBtn.focus();
  };
  openBtn.addEventListener('click', () => setOpen(true));
  root.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => setOpen(false)));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.classList.contains('max-lg:hidden')) setOpen(false); });
  // The homepage "Filter games" button links here with #filters.
  if (location.hash === '#filters' && matchMedia('(max-width: 1023px)').matches) setOpen(true);

  panel.hidden = false;
  openBtn.hidden = false;
  root.querySelector<HTMLElement>('[data-sort-wrap]')!.classList.replace('hidden', 'flex');
  reorder();
  render();
}

/** Bind every directory on the page that isn't bound yet. Safe to call on
 *  every swup:page:view. */
export function initAll() {
  // A drawer left open on the previous page would keep the scroll locked.
  document.documentElement.style.overflow = '';
  document.querySelectorAll<HTMLElement>('[data-directory]').forEach((root) => {
    if (root.dataset.ready) return;
    root.dataset.ready = '1';
    init(root);
  });
}
