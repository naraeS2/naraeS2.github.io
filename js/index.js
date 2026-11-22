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
    ${r.h ? `<p class="hook">${r.h}</p>` : ''}`;
}
[mapwrap, chips].forEach(box => box.addEventListener('click', e => {
  const t = e.target.closest('[data-r]'); if(t) showRegion(t.dataset.r);
}));
showRegion('hwangdo');

/* ----- 다섯 개의 축 : 가운데 원 + 네 구역 ↔ 전체 덮개 ----- */
const pgrid = $('#pgrid'), pdetail = $('#pdetail');
const POS = ['pc', 'tl', 'tr', 'bl', 'br'];
let lastBtn = null;
pgrid.innerHTML = PILLARS.map((p, i) => `<button class="${i ? 'pq ' + POS[i] : 'pc'}" type="button" data-i="${i}"><span class="rn">${p.rn}</span><b>${p.t}</b></button>`).join('');
pgrid.addEventListener('click', e => {
  const b = e.target.closest('[data-i]'); if(!b) return;
  lastBtn = b;
  const p = PILLARS[+b.dataset.i];
  pdetail.innerHTML = `<span class="rn">${p.rn}</span><span class="dt">${p.t}</span>${p.p.map(x => `<span class="dp">${x}</span>`).join('')}<span class="bk">눌러서 돌아가기</span>`;
  pdetail.setAttribute('aria-label', p.t + ' 설명. 누르면 닫힙니다');
  pdetail.hidden = false; pgrid.hidden = true; pdetail.focus();
});
pdetail.addEventListener('click', () => {
  pdetail.hidden = true; pgrid.hidden = false;
  if(lastBtn) lastBtn.focus();
});
