/* جلسة التركيز: عدّاد بملء الشاشة. تنفتح من «ذاكر» في الشريط السفلي، أو «الخطوة الجاية» في «لوحتي»، أو شريط الأوامر.
   الروابط: study.html#focus (اختيار الجلسة)، #focus=<رقم الجلسة> (جلسة من الخطة)، #focus=sub:<المادة> (جلسة حرة).
   لما تخلص: الجلسة تنعلّم في خطة المذاكرة، ودقايق التركيز تنحسب في أيامك المتتالية (NajdAct في layout.js).
   الجلسة الشغالة تنحفظ في najd_focus_run عشان لو قفلت الصفحة ورجعت تكمل من نفس المكان. */
(function(){
  var N=window.Najd,A=window.NajdAct;if(!N||!A)return;
  var esc=N.esc,I=N.icon,EN=document.documentElement.lang==='en';function L(a,e){return EN?e:a;}
  var RUN='najd_focus_run',LENS=[25,45,60],C=2*Math.PI*96;
  var hooks={sessions:function(){return [];},subjects:function(){return [];},markDone:function(){},len:function(){return 45;}};
  var box=null,run=null,tick=null,lock=null,last=null,pick={id:'',name:'',kind:'',len:45};

  function get(){try{return JSON.parse(localStorage.getItem(RUN)||'null');}catch(e){return null;}}
  function put(r){try{if(r)localStorage.setItem(RUN,JSON.stringify(r));else localStorage.removeItem(RUN);}catch(e){}}
  function left(r){return Math.max(0,r.paused?r.left:r.end-Date.now());}
  function fmt(ms){var s=Math.ceil(ms/1000),m=Math.floor(s/60);s%=60;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
  function buzz(ms){try{if(navigator.vibrate)navigator.vibrate(ms||30);}catch(e){}}
  /* ١ دقيقة / دقيقتين / ٣-١٠ دقائق / ١١+ دقيقة */
  function mins(n){return n===1?'دقيقة':n===2?'دقيقتين':n<=10?n+' دقائق':n+' دقيقة';}
  function reduce(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
  async function wake(on){
    try{if(on&&!lock&&navigator.wakeLock&&document.visibilityState==='visible'){lock=await navigator.wakeLock.request('screen');lock.addEventListener('release',function(){lock=null;});}
      else if(!on&&lock){await lock.release();lock=null;}}catch(e){lock=null;}
  }
  var KIND={review:L('مراجعة المحاضرة','Lecture review'),study:L('مذاكرة','Study'),hw:L('تحضير','Prep'),final:L('مراجعة شاملة قبل الاختبار','Full review before the exam'),free:L('جلسة حرة','Free session')};

  function build(){
    if(box)return box;
    box=document.createElement('div');box.className='nj-focus';box.id='nj-focus';box.hidden=true;
    box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-labelledby','fx-h');
    box.innerHTML='<div class="fx-in"><button type="button" class="fx-x" data-fx="close" aria-label="'+L('إغلاق','Close')+'">'+I('close')+'</button><div class="fx-body" id="fx-body"></div></div>';
    document.getElementById('najd').appendChild(box);
    box.addEventListener('click',onClick);
    box.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}
      if(e.key==='Tab'){var f=box.querySelectorAll('button:not([disabled]),a[href]');if(!f.length)return;var a=f[0],z=f[f.length-1];
        if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}});
    return box;
  }
  function show(){build();if(box.hidden){last=document.activeElement;box.hidden=false;document.documentElement.classList.add('nj-noscroll');}}
  function hide(){if(!box||box.hidden)return;box.hidden=true;document.documentElement.classList.remove('nj-noscroll');clearInterval(tick);tick=null;wake(false);if(last&&last.focus)last.focus();}
  function body(){return document.getElementById('fx-body');}
  function focusFirst(sel){setTimeout(function(){var el=box.querySelector(sel)||box.querySelector('button');if(el)el.focus();},40);}

  /* ===== اختيار الجلسة ===== */
  function openPick(){
    show();var ses=hooks.sessions()||[],subs=hooks.subjects()||[];pick.len=+hooks.len()||45;
    if(ses.length){pick.id=ses[0].id;pick.name=ses[0].name;pick.kind=ses[0].kind;pick.len=ses[0].len||pick.len;}
    else{pick.id='';pick.name=subs[0]?subs[0].name:'';pick.kind='free';}
    var o='<h2 id="fx-h">'+L('وش تذاكر الحين؟','What are you studying now?')+'</h2>';
    if(ses.length)o+='<p class="fx-lbl">'+L('جلسات اليوم من خطتك','Today\'s sessions from your plan')+'</p><div class="fx-list" role="radiogroup" aria-label="'+L('جلسات اليوم','Today\'s sessions')+'">'
      +ses.map(function(x,i){return '<button type="button" class="fx-opt" role="radio" aria-checked="'+(i===0)+'" data-ses="'+esc(x.id)+'" data-name="'+esc(x.name)+'" data-kind="'+esc(x.kind)+'" data-len="'+(x.len||45)+'"><b data-no-i18n>'+esc(x.name)+'</b><small>'+esc((KIND[x.kind]||'')+' · '+x.when)+'</small></button>';}).join('')+'</div>';
    o+='<p class="fx-lbl">'+(ses.length?L('أو جلسة حرة','Or a free session'):L('اختر المادة','Pick a subject'))+'</p><div class="fx-chips" role="radiogroup" aria-label="'+L('المادة','Subject')+'">'
      +subs.map(function(x,i){return '<button type="button" class="fx-chip" role="radio" aria-checked="'+(!ses.length&&i===0)+'" data-sub="'+esc(x.name)+'" data-no-i18n>'+esc(x.code||x.name)+'</button>';}).join('')
      +'<button type="button" class="fx-chip" role="radio" aria-checked="'+(!ses.length&&!subs.length)+'" data-sub="">'+L('بدون مادة','No subject')+'</button></div>'
      +'<p class="fx-lbl">'+L('المدة','Length')+'</p><div class="fx-seg" role="radiogroup" aria-label="'+L('المدة','Length')+'">'+LENS.map(function(n){return '<button type="button" role="radio" data-len="'+n+'" aria-checked="'+(n===pick.len)+'"><b>'+n+'</b> '+L('د','min')+'</button>';}).join('')+'</div>'
      +'<button type="button" class="fx-go" data-fx="start">'+I('play')+L('ابدأ الجلسة','Start session')+'</button>';
    body().innerHTML=o;box.className='nj-focus is-pick';focusFirst('[aria-checked="true"]');
  }
  /* اختيار واحد: الجلسة أو المادة مع بعض، والمدة لحالها */
  function radio(group,el){group.querySelectorAll('[role=radio]').forEach(function(b){b.setAttribute('aria-checked',b===el?'true':'false');});}
  function pickOne(el){body().querySelectorAll('.fx-list [role=radio],.fx-chips [role=radio]').forEach(function(b){b.setAttribute('aria-checked',b===el?'true':'false');});}

  /* ===== الجلسة الشغالة ===== */
  function start(o){
    run={id:o.id||'',name:o.name||'',kind:o.kind||'free',len:+o.len||45,end:Date.now()+(+o.len||45)*60000,paused:false,left:0,at:Date.now()};
    put(run);drawRun();buzz(20);
  }
  function drawRun(){
    show();box.className='nj-focus is-run';
    var title=run.name?run.name:L('مذاكرة','Study');
    body().innerHTML='<p class="fx-k" id="fx-h"><span data-no-i18n>'+esc(title)+'</span> · '+esc(KIND[run.kind]||KIND.free)+'</p>'
      +'<div class="fx-ring" role="timer" aria-live="off"><svg viewBox="0 0 220 220" aria-hidden="true"><circle cx="110" cy="110" r="96" class="fx-rb"/><circle cx="110" cy="110" r="96" class="fx-rf" id="fx-rf" style="stroke-dasharray:'+C.toFixed(1)+'"/></svg>'
      +'<div class="fx-rt"><b id="fx-t" dir="ltr">--:--</b><small id="fx-s"></small></div></div>'
      +'<div class="fx-btns"><button type="button" class="fx-b" data-fx="pause" id="fx-p"></button><button type="button" class="fx-b main" data-fx="done">'+I('check')+L('خلّصت','Done')+'</button></div>'
      +'<p class="fx-tip">'+L('خلّ الجوال على جنب. لو طلعت من الصفحة، العدّاد يكمل.','Put your phone aside. The timer keeps going if you leave the page.')+'</p>';
    /* لو الوقت خلص وهو بعيد، update تنهي الجلسة على طول وتعرض شاشة النهاية */
    update();if(!run)return;
    clearInterval(tick);tick=setInterval(update,500);wake(!run.paused);focusFirst('[data-fx="done"]');
  }
  function update(){
    if(!run)return;var ms=left(run),t=document.getElementById('fx-t');if(!t)return;
    t.textContent=fmt(ms);
    var rf=document.getElementById('fx-rf');if(rf)rf.style.strokeDashoffset=(C*(1-ms/(run.len*60000))).toFixed(1);
    document.getElementById('fx-s').textContent=run.paused?L('موقفة مؤقتًا','Paused'):L('ركّز، الجوال على جنب','Focus. Phone aside.');
    var p=document.getElementById('fx-p');p.innerHTML=(run.paused?I('play')+L('كمّل','Resume'):I('pause')+L('إيقاف مؤقت','Pause'));
    if(!run.paused&&ms<=0)finish(true);
  }
  function togglePause(){
    if(!run)return;
    if(run.paused){run.end=Date.now()+run.left;run.paused=false;wake(true);}
    else{run.left=left(run);run.paused=true;wake(false);}
    put(run);update();
  }
  function finish(auto){
    if(!run)return;var r=run;run=null;put(null);clearInterval(tick);tick=null;wake(false);
    var spent=Math.max(1,Math.round((r.len*60000-left(r))/60000));if(auto)spent=r.len;
    if(r.id)hooks.markDone(r.id);
    A.log('f',spent);
    buzz([30,60,30]);win(r,spent);
  }
  function win(r,spent){
    var sk=A.streak(),n=sk.n;
    body().innerHTML='<div class="fx-mtn'+(reduce()?' is-still':'')+'" aria-hidden="true"><svg viewBox="0 0 200 110"><circle cx="150" cy="26" r="11" fill="#D9B48A"/><path d="M8 102L58 48l22 22 30-40 50 72z" fill="rgba(255,255,255,.16)"/><path d="M60 102l50-72 50 72z" fill="rgba(255,255,255,.3)"/><path class="fx-trail" d="M70 96 L84 78 L96 66 L104 48 L110 30" fill="none" stroke="#D9B48A" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 7"/><circle class="fx-dot" cx="110" cy="30" r="6" fill="#fff"/></svg></div>'
      +'<h2 id="fx-h">'+(r.name?L('خلّصت جلسة ','You finished ')+'<span data-no-i18n>'+esc(r.name)+'</span>':L('خلّصت الجلسة','Session done'))+'</h2>'
      +'<p class="fx-sub">'+(EN?(spent===1?'1 minute':spent+' minutes')+' of focus. ':mins(spent)+' تركيز. ')
      +(n<=1?L('بدأت أيامك المتتالية، ارجع بكرة وكمّلها.','Your streak has started. Come back tomorrow.'):L('صارت أيامك المتتالية ','Your streak is now ')+A.daysTxt(n)+'.')+'</p>'
      +'<div class="fx-week" aria-label="'+L('أيام هذا الأسبوع','This week')+'">'+sk.week.map(function(d){return '<i class="'+(d.on?'on':'')+(d.today?' today':'')+'"></i>';}).join('')+'</div>'
      +'<button type="button" class="fx-go" data-fx="close">'+L('رجوع ليومك','Back to your day')+'</button>';
    box.className='nj-focus is-win';focusFirst('[data-fx="close"]');
  }
  function close(){
    if(run){/* وقفنا الجلسة بدون ما تنحسب، و«تراجع» يرجعها */
      var r=run;r.left=left(r);r.paused=true;run=null;put(null);hide();
      N.toast(L('وقفنا الجلسة','Session stopped'),{undo:function(){run=r;put(r);drawRun();}});return;}
    hide();
  }
  function onClick(e){
    var b=e.target.closest('button');if(!b||!box.contains(b))return;
    var fx=b.getAttribute('data-fx');
    if(fx==='close'){close();return;}
    if(fx==='pause'){togglePause();return;}
    if(fx==='done'){finish(false);return;}
    if(fx==='start'){start(pick);return;}
    if(b.hasAttribute('data-ses')){pickOne(b);pick={id:b.getAttribute('data-ses'),name:b.getAttribute('data-name'),kind:b.getAttribute('data-kind'),len:+b.getAttribute('data-len')||pick.len};
      body().querySelectorAll('.fx-seg [role=radio]').forEach(function(x){x.setAttribute('aria-checked',+x.getAttribute('data-len')===pick.len?'true':'false');});return;}
    if(b.hasAttribute('data-sub')){pickOne(b);pick.id='';pick.kind='free';pick.name=b.getAttribute('data-sub');return;}
    if(b.closest('.fx-seg')&&b.hasAttribute('data-len')){radio(b.closest('.fx-seg'),b);pick.len=+b.getAttribute('data-len');}
  }

  /* الرابط: #focus أو #focus=<الجلسة> أو #focus=sub:<المادة> */
  function fromHash(){
    var h=(location.hash||'').slice(1);try{h=decodeURIComponent(h);}catch(e){}if(h.indexOf('focus')!==0)return false;
    try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
    var arg=h.slice(6);if(run)return drawRun(),true;
    if(!arg){openPick();return true;}
    if(arg.indexOf('sub:')===0){start({name:arg.slice(4),kind:'free',len:hooks.len()});return true;}
    var x=(hooks.sessions()||[]).filter(function(s){return s.id===arg;})[0];
    if(x)start({id:x.id,name:x.name,kind:x.kind,len:x.len});else openPick();
    return true;
  }
  window.addEventListener('hashchange',fromHash);
  document.addEventListener('visibilitychange',function(){if(document.hidden)return;if(run){if(!run.paused)wake(true);update();}});

  window.NajdFocus={
    init:function(h){for(var k in h)hooks[k]=h[k];
      var r=get();if(r&&r.end){run=r;drawRun();return;}
      fromHash();},
    open:function(){if(run)drawRun();else openPick();},
    running:function(){return !!run;}
  };
})();
