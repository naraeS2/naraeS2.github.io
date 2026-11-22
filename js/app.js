/* 공통 동작 : 모든 페이지에서 불러옵니다 */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = id => CHARS.find(c => c.id === id);

/* ----- 타로 카드 만들기 (앞면 / 뒷면 뒤집기) ----- */
function makeCard(c){
  const el = document.createElement('article');
  el.className = 'tcard';
  el.dataset.id = c.id;
  el.style.setProperty('--a', c.a);
  const art = c.img
    ? `<img src="${c.img}" alt="${c.name} 일러스트" loading="lazy">`
    : `<div class="ph"><svg aria-hidden="true"><use href="#star8"/></svg><i>${c.num}</i></div>`;
  const corners = ['a','b','c','d'].map(k => `<svg class="cn ${k}" aria-hidden="true"><use href="#corner"/></svg>`).join('');
  const ver = c.ver ? `<span class="ver">${c.ver}</span>` : '';
  const ageLine = c.ver && /세/.test(c.ver) ? c.ver : [c.age, c.ver].filter(Boolean).join(' · ');
  el.innerHTML = `
    <div class="inner">
      <div class="face front">
        ${corners}
        <div class="art">${art}</div>
        <div class="plate"><span class="num">${c.num}</span><strong class="nm">${c.name}</strong><em class="en">${c.en}</em>${ver}</div>
        <button class="flip" type="button" aria-label="${c.name}${c.ver ? ' (' + c.ver + ')' : ''} 카드 뒤집기"></button>
      </div>
      <div class="face back">
        ${corners}
        <span class="role">${c.role}</span>
        <h3>${c.name}</h3>
        ${ageLine ? `<span class="age">${ageLine}</span>` : ''}
        <svg class="fl" aria-hidden="true"><use href="#flourish"/></svg>
        <p class="hook">${c.hook}</p>
        <ul class="kw">${c.kw.map(k => `<li>${k}</li>`).join('')}</ul>
        <div class="acts">
          ${c.soon ? `<span class="go soon">준비 중</span>` : ''}${c.link ? `<a class="go" href="${c.link}" target="_blank" rel="noopener">✦ 대화하러 가기 ✦</a>` : ''}
          <button class="fb flip" type="button">앞면 보기</button>
        </div>
      </div>
    </div>`;
  const front = $('.front', el), back = $('.back', el);
  const set = on => {
    el.classList.toggle('flipped', on);
    front.inert = on; back.inert = !on;
  };
  set(false);
  $$('.flip', el).forEach(b => b.addEventListener('click', () => set(!el.classList.contains('flipped'))));
  el.setFlip = set;
  return el;
}
