/* ----- 카드 뽑기 : 카드가 왼쪽 → 오른쪽으로 흘러가고, 한 번 누르면 그 카드가 뽑힘 ----- */
const flow = $('#flow'), track = $('#track'), res = $('#res'), hint = $('#hint');
const N = 16;   /* 한 묶음의 카드 수. 같은 묶음을 두 번 이어 붙여 끊김 없이 반복 */
const setHTML = focusable => `<div class="set"${focusable ? '' : ' aria-hidden="true"'}>` +
  Array.from({length: N}, () => `<button class="fc" type="button" aria-label="카드 한 장 뽑기"${focusable ? '' : ' tabindex="-1"'}></button>`).join('') + '</div>';
track.innerHTML = setHTML(true) + setHTML(false);

let picking = false;
flow.addEventListener('click', e => {
  const b = e.target.closest('.fc'); if(!b || picking) return;
  picking = true;
  flow.classList.add('picked'); b.classList.add('chosen'); hint.hidden = true;
  setTimeout(() => reveal(CHARS[Math.floor(Math.random() * CHARS.length)]), reduce ? 0 : 700);
});

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
      <a class="btn main" href="characters.html#${c.id}">캐릭터 카드에서 보기</a>
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
