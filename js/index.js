/* ----- 회전 고리 : 글자를 HTML 요소로 원 위에 배치 (iOS Safari 호환) ----- */
(function(){
  const box = $('#ringtext');
  const roman = ['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
  const chars = [...(roman.join(' ✦ ') + ' ✦ ')];
  const step = 360 / chars.length;
  const frag = document.createDocumentFragment();
  chars.forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch;
    s.style.setProperty('--r', (i * step).toFixed(3) + 'deg');
    frag.appendChild(s);
  });
  box.appendChild(frag);
})();

/* ----- 지도 ----- */
const mapwrap = $('#mapwrap'), chips = $('#chips'), panel = $('#panel');
REGIONS.forEach(r => {
  if(r.x != null){
    const h = document.createElement('button');
    h.type = 'button'; h.className = 'hs'; h.dataset.r = r.id; h.setAttribute('aria-label', r.n);
    h.style.cssText = `left:${r.x}%;top:${r.y}%;width:${r.w2}%;height:${r.h2}%`;
    mapwrap.appendChild(h);
  }
  const c = document.createElement('button');
  c.type = 'button'; c.className = 'chip'; c.dataset.r = r.id; c.textContent = r.n;
  chips.appendChild(c);
});
function showRegion(id){
  const r = REGIONS.find(x => x.id === id);
  $$('[data-r]').forEach(el => {
    const on = el.dataset.r === id;
    el.classList.toggle('on', on);
    if(el.classList.contains('chip')) el.setAttribute('aria-pressed', on);
  });
  const rows = [['사람들', r.p], ['명물', r.m], ['발달한 기술', r.k], ['벌어지는 일', r.i]].filter(x => x[1]);
  panel.innerHTML = `<h3>${r.n}</h3><div class="where">${r.w}</div><p>${r.t}</p>
    <dl>${rows.map(x => `<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join('')}</dl>
    ${r.x2 ? `<p class="more">${r.x2}</p>` : ''}
    ${r.h ? `<p class="hook">${r.h}</p>` : ''}${r.d ? `<span class="days">수도에서 ${r.d}</span>` : ''}`;
}
[mapwrap, chips].forEach(box => box.addEventListener('click', e => {
  const t = e.target.closest('[data-r]'); if(t) showRegion(t.dataset.r);
}));
showRegion('hwangdo');

/* ----- 제국의 안쪽 ----- */
const loreTabs = $('#loreTabs'), loreList = $('#loreList');
let loreCat = LORE[0].c;
function renderLore(){
  const cats = LORE.filter(g => loreCat === '전체' || g.c === loreCat);
  loreList.innerHTML = cats.map(g => `
    ${loreCat === '전체' ? `<h4 class="cat">${g.c}</h4>` : ''}
    ${g.e.map(([t, x]) => `<details><summary>${t}</summary><p>${x}</p></details>`).join('')}`).join('');
  $$('.chip', loreTabs).forEach(b => b.setAttribute('aria-pressed', b.dataset.c === loreCat));
}
loreTabs.innerHTML = ['전체', ...LORE.map(g => g.c)].map(c => `<button class="chip" type="button" data-c="${c}">${c}</button>`).join('');
loreTabs.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if(b){ loreCat = b.dataset.c; renderLore(); } });
renderLore();

/* ----- 오늘의 카드 ----- */
const deck = $('#deck'), res = $('#res'), dPick = $('#dPick');
let picks = [];
function shuffle(a){
  a = [...a];
  for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function openDraw(){
  picks = shuffle(CHARS).slice(0, 3);
  deck.innerHTML = picks.map((c, i) => `<button class="dk" type="button" data-i="${i}" aria-label="${i + 1}번째 카드 고르기"></button>`).join('');
  dPick.hidden = false; res.hidden = true; res.replaceChildren();
}
function reveal(i){
  const c = picks[i];
  const card = makeCard(c); card.classList.add('pop');
  const box = document.createElement('div');
  box.append(card);
  const info = document.createElement('div');
  info.innerHTML = `
    <h3>오늘의 카드는 ‘${c.en}’</h3>
    <p>${c.name}${c.ver ? ' (' + c.ver + ')' : ''} · ${c.role}</p>
    <p>카드를 눌러 뒤집어 보세요.</p>
    <div class="cta">
      <a class="btn main" href="characters.html#${c.id}">인물 카드에서 보기</a>
      <button class="btn ghost" type="button" id="again">다시 뽑기</button>
    </div>`;
  res.replaceChildren(box, info);
  dPick.hidden = true; res.hidden = false;
  $('#again', res).onclick = () => { openDraw(); $('#draw').scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); };
  res.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'center'});
}
deck.addEventListener('click', e => { const b = e.target.closest('.dk'); if(b) reveal(+b.dataset.i); });
openDraw();

/* ----- 히어로 시차 (마우스 환경에서만) ----- */
const halo = $('#halo');
if(!reduce && matchMedia('(hover:hover)').matches){
  let raf = 0;
  addEventListener('pointermove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = (e.clientX / innerWidth - .5) * 14, y = (e.clientY / innerHeight - .5) * 14;
      halo.style.setProperty('--px', x + 'px'); halo.style.setProperty('--py', y + 'px');
    });
  }, {passive:true});
}
