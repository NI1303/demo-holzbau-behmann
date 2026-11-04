/* Holzbau Behmann – Seitenfunktionen: Werkplan-Bauteile, Skizzen-Wechsel, Projektmappe ziehen */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const info = window.PART_INFO || {};

  // Werkplan: Bauteil überfahren/antippen → markieren und erklären
  const plan = $('.plan'), out = $('[data-part-info]');
  if (plan && out) {
    const def = out.textContent;
    const set = k => {
      $$('[data-part]', plan).forEach(el => el.classList.toggle('hi', !!k && el.dataset.part === k));
      out.textContent = k ? (info[k] || '') : def;
    };
    $$('[data-part]', plan).forEach(el => {
      el.addEventListener('pointerenter', () => set(el.dataset.part));
      el.addEventListener('click', () => set(el.dataset.part));
    });
    plan.addEventListener('pointerleave', () => set(null));
  }

  // Skizze zum gewählten Vorhaben
  const sks = $$('.sk');
  const show = k => sks.forEach(s => { const on = s.dataset.sk === k; if (on && !s.classList.contains('on')) { s.classList.remove('on'); void s.offsetWidth; } s.classList.toggle('on', on); });
  $$('[data-sk-pick]').forEach(r => r.addEventListener('change', () => show(r.dataset.skPick)));
  const cur = $('[data-sk-pick]:checked'); show(cur ? cur.dataset.skPick : 'dach');
  $$('[data-sk-go]').forEach(a => a.addEventListener('click', () => {
    const r = $(`[data-sk-pick="${a.dataset.skGo}"]`); if (r) { r.checked = true; show(r.dataset.skPick); }
  }));

  // Projektmappe mit der Maus ziehen
  const row = $('[data-drag]');
  if (row && matchMedia('(pointer: fine)').matches) {
    let down = false, sx = 0, sl = 0, moved = false;
    row.addEventListener('pointerdown', e => { if (e.button) return; down = true; moved = false; sx = e.clientX; sl = row.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; row.classList.add('drag'); } row.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => row.classList.remove('drag'), 0); });
    row.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    row.addEventListener('keydown', e => { if (e.key === 'ArrowRight') row.scrollBy({ left: 300, behavior: 'smooth' }); if (e.key === 'ArrowLeft') row.scrollBy({ left: -300, behavior: 'smooth' }); });
  }
})();
