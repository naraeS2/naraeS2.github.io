/* 공통 동작 : 모든 페이지에서 불러옵니다 */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = id => CHARS.find(c => c.id === id);
const CORNERS = ['a','b','c','d'].map(k => `<svg class="cn ${k}" aria-hidden="true"><use href="#corner"/></svg>`).join('');

/* 앞면 / 뒷면 뒤집기 연결 */
function wireFlip(el){
  const front = $('.front', el), back = $('.back', el);
  const set = on => {
    el.classList.toggle('flipped', on);
    front.inert = on; back.inert = !on;
  };
  set(false);
  $$('.flip', el).forEach(b => b.addEventListener('click', () => set(!el.classList.contains('flipped'))));
  el.setFlip = set;
}
const artHTML = (img, alt, num) => img
  ? `<img src="${img}" alt="${alt}" loading="lazy">`
  : `<div class="ph"><svg aria-hidden="true"><use href="#star8"/></svg><i>${num}</i></div>`;

/* ----- 캐릭터 타로 카드 ----- */
function makeCard(c){
  const el = document.createElement('article');
  el.className = 'tcard';
  el.dataset.id = c.id;
  el.style.setProperty('--a', c.a);
  if(STORIES.some(s => (s.who || []).includes(c.id))) el.classList.add('tale');   /* 스토리에 속한 캐릭터 카드는 바탕색이 다름 */
  const ver = c.ver ? `<span class="ver">${c.ver}</span>` : '';
  const ageLine = c.ver && /세/.test(c.ver) ? c.ver : [c.age, c.ver].filter(Boolean).join(' · ');
  el.innerHTML = `
    <div class="inner">
      <div class="face front">
        ${CORNERS}
        <div class="art">${artHTML(c.img, c.name + ' 일러스트', c.num)}</div>
        <div class="plate"><span class="num">${c.num}</span><strong class="nm">${c.name}</strong><em class="en">${c.en}</em>${ver}</div>
        <button class="flip" type="button" aria-label="${c.name}${c.ver ? ' (' + c.ver + ')' : ''} 카드 뒤집기"></button>
      </div>
      <div class="face back">
        ${CORNERS}
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
  wireFlip(el);
  return el;
}

/* ----- 스토리 타로 카드 ----- */
const whoName = c => c.name + (CHARS.filter(x => x.name === c.name).length > 1 ? ' (' + c.age + ')' : '');   /* 이름이 같은 카드는 나이를 붙여 구분 */
function makeStoryCard(s){
  const el = document.createElement('article');
  el.className = 'tcard story';
  el.dataset.id = s.id;
  el.style.setProperty('--a', s.a);
  const who = (s.who || []).map(byId).filter(Boolean);
  el.innerHTML = `
    <div class="inner">
      <div class="face front">
        ${CORNERS}
        <div class="art">${artHTML(s.img, s.t + ' 표지', s.num)}</div>
        <div class="plate"><span class="num">${s.num}</span><strong class="nm">${s.t}</strong><em class="en">${s.en}</em></div>
        <button class="flip" type="button" aria-label="${s.t} 스토리 카드 뒤집기"></button>
      </div>
      <div class="face back">
        ${CORNERS}
        <span class="role">${s.gen}</span>
        <h3>${s.t}</h3>
        <svg class="fl" aria-hidden="true"><use href="#flourish"/></svg>
        <p class="one">${s.one}</p>
        <p class="hook">${s.txt}</p>
        ${who.length ? `<ul class="kw who">${who.map(c => `<li><a href="#${c.id}" data-char="${c.id}">${whoName(c)}</a></li>`).join('')}</ul>` : ''}
        <div class="acts">
          ${s.soon ? `<span class="go soon">준비 중</span>` : ''}${s.link ? `<a class="go" href="${s.link}" target="_blank" rel="noopener">✦ 대화하러 가기 ✦</a>` : ''}
          <button class="fb flip" type="button">앞면 보기</button>
        </div>
      </div>
    </div>`;
  wireFlip(el);
  return el;
}
