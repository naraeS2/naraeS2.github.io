/* ----- 카드 뽑기 : 부채꼴로 겹쳐진 카드. 손이 닿으면 색이 바뀌고, 누르면 랜덤으로 한 장이 뽑힘 ----- */
const flow = $('#flow'), fan = $('#fan'), res = $('#res'), hint = $('#hint');
const N = 9;
fan.innerHTML = Array.from({length: N}, (_, i) =>
  `<button class="fc" type="button" style="--i:${i}" aria-label="카드 ${i + 1}번째 뽑기"></button>`).join('');

let picking = false, hot = null, sx = 0, sy = 0, slid = false;
const under = e => { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.closest('.fc'); };
function setHot(b){
  if(hot === b) return;
  if(hot) hot.classList.remove('hot');
  hot = b;
  if(hot) hot.classList.add('hot');
}

/* 마우스·손가락이 카드 위를 지나갈 때 색이 바뀜 (손가락은 쓸어 넘겨도 따라감) */
fan.addEventListener('pointerdown', e => { if(picking) return; sx = e.clientX; sy = e.clientY; slid = false; setHot(under(e)); });
fan.addEventListener('pointermove', e => {
  if(picking) return;
  if(Math.hypot(e.clientX - sx, e.clientY - sy) > 10) slid = true;
  setHot(under(e));
});
fan.addEventListener('pointerleave', () => setHot(null));
fan.addEventListener('pointercancel', () => setHot(null));
fan.addEventListener('pointerup', e => {
  if(picking) return;
  /* 손가락을 쓸어서 올려놓은 경우: 손을 뗀 자리의 카드를 뽑음 (그냥 톡 누르면 click 이 처리) */
  if(e.pointerType === 'touch'){
    const b = slid ? under(e) : null;
    if(b) pick(b); else setHot(null);
  }
});
fan.addEventListener('click', e => {
  const b = e.target.closest('.fc'); if(b) pick(b);
});

function pick(b){
  if(picking) return;
  picking = true; setHot(null);
  flow.classList.add('picked'); b.classList.add('chosen'); hint.hidden = true;
  setTimeout(() => reveal(CHARS[Math.floor(Math.random() * CHARS.length)]), reduce ? 0 : 750);
}

function reveal(c){
  const card = makeCard(c); card.classList.add('pop');
  const box = document.createElement('div');
  box.append(card);
  const info = document.createElement('div');
  info.innerHTML = `
    <h3>오늘의 카드는 ‘${c.en}’</h3>
    <p>${c.name}${c.ver ? ' (' + c.ver + ')' : ''} · ${c.role}</p>
    <p>카드를 눌러 뒤집어 보세요.</p>
    <div class="cta">
      <a class="btn main" href="tarot.html#${c.id}">Tarot Card에서 보기</a>
      <button class="btn ghost" type="button" id="again">다시 뽑기</button>
    </div>`;
  res.replaceChildren(box, info);
  flow.hidden = true; res.hidden = false;
  $('#again', res).onclick = again;
  res.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'center'});
}
function again(){
  res.hidden = true; res.replaceChildren();
  flow.hidden = false; flow.classList.remove('picked');
  $$('.fc.chosen', flow).forEach(x => x.classList.remove('chosen'));
  hint.hidden = false; picking = false;
}
